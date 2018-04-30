"""
Wine Update Function for DrinkRank
- Extract Wine's primary key
- Extract other Updated Info
- Set the Status to "Pending"

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3
from botocore.exceptions import ClientError
from datetime import datetime

# Global Pending Update Token
pending_token = 'PU'
# Global Wine Table Name
wine_table = 'Wines'


def update_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return:
    """
    # Get the Primary Key of the Wine
    wine_id = str(event['ID'])
    # Get the Other Info which needs to be updated
    wine_name = event['Name']
    wine_alcohol = str(event['Alcohol'])
    wine_type = event['BeverageType']
    wine_category = event['Category']
    wine_country = event['Country']
    wine_manufacturer_email = event['ManufacturerEmail']
    wine_manufacturer_name = event['ManufacturerName']
    wine_price = str(event['Price'])
    wine_vintage = str(event['Vintage'])
    # Taste Notes
    wine_sweetness = str(event['Sweetness'])
    wine_sourness = str(event['Sourness'])
    wine_bitterness = str(event['Bitterness'])

    # DynamoDB Client
    db_client = boto3.client('dynamodb')

    # Try - Exception - Else Block
    try:
        # Try to update the item
        # Get Current time
        cur_time = datetime.now().strftime("%Y%m%d %H:%M:%S")
        # Currently, using UPDATE and Set Status to 'P' instead of directly updating
        # Update Expression
        update_expr = "SET " + "#AL = :al, #TP = :tp, #CAT = :cat, #CTRY = :ctry, #ME = :me, #MN = :mn," + \
                      "#N = :n, #PR = :pr, #ST = :st, #TS_ST = :ts, #VIN = :vin," + \
                      "#BT = :bt, #SW = :sw, #SO = :so"
        response = db_client.update_item(TableName=wine_table,
                                         Key={'ID': {'N': wine_id}},
                                         UpdateExpression=update_expr,
                                         ExpressionAttributeNames={
                                             '#AL': 'Alcohol',
                                             '#TP': 'BeverageType',
                                             '#CAT': 'Category',
                                             '#CTRY': 'Country',
                                             '#ME': 'ManufacturerEmailId',
                                             '#MN': 'ManufacturerName',
                                             '#N': 'Name',
                                             '#PR': 'Price',
                                             '#ST': 'Status',
                                             '#TS_ST': 'TimeStampStatusChange',
                                             '#VIN': 'Vintage',
                                             '#BT': 'Bitterness',
                                             '#SW': 'Sweetness',
                                             '#SO': 'Sourness'
                                         },
                                         ExpressionAttributeValues={
                                             ':al': {'N': wine_alcohol},
                                             ':tp': {'S': wine_type},
                                             ':cat': {'S': wine_category},
                                             ':ctry': {'S': wine_country},
                                             ':me': {'S': wine_manufacturer_email},
                                             ':mn': {'S': wine_manufacturer_name},
                                             ':n': {'S': wine_name},
                                             ':pr': {'N': wine_price},
                                             ':st': {'S': pending_token},
                                             ':ts': {'S': cur_time},
                                             ':vin': {'N': wine_vintage},
                                             ':bt': {'N': wine_bitterness},
                                             ':sw': {'N': wine_sweetness},
                                             ':so': {'N': wine_sourness}
                                         },
                                         ReturnValues='UPDATED_NEW')
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print(e.response['Error']['Message'])
        raise Exception("Bad Request: Update Failed.")
    else:
        # Update Succeeded
        # Response will contain - {'Attributes': {'Status': {'S': 'PU'}}
        if response['Attributes']['Status']['S'] == pending_token:
            return {
                'Message': 'Update Succeeded',
                'ID': wine_id,
                'Alcohol': wine_alcohol,
                'BeverageType': wine_type,
                'Category': wine_category,
                'Country': wine_country,
                'Name': wine_name,
                'Price': wine_price,
                'Status': pending_token,
                'Vintage': wine_vintage,
                'Bitterness': wine_bitterness,
                'Sweetness': wine_sweetness,
                'Sourness': wine_sourness
            }

    raise Exception("Bad Request: Update Failed.")
