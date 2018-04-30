"""
Wine Update Function for DrinkRank
- Extract Wine Manufacturer Info
- Scan the DB

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3
from botocore.exceptions import ClientError

# Global Pending Addition Token
pending_addition_token = 'PA'
# Glpbal Approval Token
approval_token = 'A'
# Global Pending Update Token
pending_update_token = 'PU'
# Glpbal Update Token
update_token = 'U'
# Global Wine Table Name
wine_table = 'Wines'


def mfr_query_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return: Wine dict of certain Manufacturer / Empty
    """
    # DynamoDB Client
    db_client = boto3.client('dynamodb')

    # Get the Other Info Provided by Manufacturer
    wine_manufacturer_email = event['ManufacturerEmail']
    wine_manufacturer_name = event['ManufacturerName']

    # Get All Wines in Approval or Pending status
    # Scan with Manufacturer Email and Name, and Status
    filter_expr = "#MFR_E = :e and #MFR_N = :n and (#ST = :a or #ST = :u or #ST = :pa or #ST = :pu)"
    # Returned Attributes
    proj_expr = "#ID, #N, #AL, #BT, #Cat, #Ctry, #Pr, #Vin, #ST, #Btr, #Swt, #Sour"
    try:
        response = db_client.scan(TableName=wine_table,
                                  FilterExpression=filter_expr,
                                  ProjectionExpression=proj_expr,
                                  ExpressionAttributeNames={
                                      '#MFR_E': 'ManufacturerEmailId',
                                      '#MFR_N': 'ManufacturerName',
                                      '#ST': 'Status',
                                      '#ID': 'ID',
                                      '#N': 'Name',
                                      '#AL': 'Alcohol',
                                      '#BT': 'BeverageType',
                                      '#Cat': 'Category',
                                      '#Ctry': 'Country',
                                      '#Pr': 'Price',
                                      '#Vin': 'Vintage',
                                      '#Btr': 'Bitterness',
                                      '#Swt': 'Sweetness',
                                      '#Sour': 'Sourness'
                                  },
                                  ExpressionAttributeValues={
                                      ':e': {'S': wine_manufacturer_email},
                                      ':n': {'S': wine_manufacturer_name},
                                      ':a': {'S': approval_token},
                                      ':pa': {'S': pending_addition_token},
                                      ':u': {'S': update_token},
                                      ':pu': {'S': pending_update_token}
                                  },
                                  ConsistentRead=True
                                  )
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise Exception("Bad Request: Query Failed.")
    else:
        # If No Wines
        if 'Items' in response.keys() and len(response['Items']) == 0:
            return {
                'Message': 'Empty',
                'Count': 0
            }
        # If Find Wines in Table
        elif 'Items' in response.keys() and len(response['Items']) > 0:
            # Unpacking Items and Put into a New List
            item_list = list()
            for item in response['Items']:
                # Item Dict
                item_dict = dict()
                # For each Attribute
                for k in item.keys():
                    # String Type Attributes
                    if 'S' in item[k].keys():
                        item_dict[k] = item[k]['S']
                    # Number Type Attributes
                    elif 'N' in item[k].keys():
                        item_dict[k] = item[k]['N']
                item_list.append(item_dict)
            
            return {
                'Message': 'Succeeded',
                'Items': item_list,
                'Count': response['Count']
            }
