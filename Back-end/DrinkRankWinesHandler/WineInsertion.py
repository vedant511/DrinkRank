"""
Wine Update Function for DrinkRank
- Assign the Wine's primary key
- Extract Wine Info
- Set the Status to "Pending"

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3
from botocore.exceptions import ClientError
from datetime import datetime

# Global Pending Addition Token
pending_token = 'PA'
# Global Wine Table Name
wine_table = 'Wines'


def insertion_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return:
    """
    # DynamoDB Client
    db_client = boto3.client('dynamodb')

    # Get the Primary Key of the Wine
    wine_id = id_assignment(db_client=db_client, table_name=wine_table)

    # Get the Other Info Provided by Manufacturer
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

    # Try - Except
    try:
        # Get Current time
        cur_time = datetime.now().strftime("%Y%m%d %H:%M:%S")
        # Currently, using UPDATE and Set Status to 'P' instead of directly updating
        response = db_client.put_item(TableName=wine_table,
                                      Item={
                                          'ID': {'N': wine_id},
                                          'Alcohol': {'N': wine_alcohol},
                                          'BeverageType': {'S': wine_type},
                                          'Bitterness': {'N': wine_bitterness},
                                          'Category': {'S': wine_category},
                                          'Country': {'S': wine_country},
                                          'ManufacturerEmailId': {'S': wine_manufacturer_email},
                                          'ManufacturerName': {'S': wine_manufacturer_name},
                                          'Name': {'S': wine_name},
                                          'Price': {'N': wine_price},
                                          'Rating': {'N': '0'},
                                          'Sourness': {'N': wine_sourness},
                                          'Status': {'S': pending_token},
                                          'Sweetness': {'N': wine_sweetness},
                                          'TimeStampAdded': {'S': cur_time},
                                          'TimeStampStatusChange': {'S': cur_time},
                                          'Vintage': {'N': wine_vintage}
                                      })
    except ClientError:
        raise Exception("Bad Request: Posting Failed.")

    # Return New Wine Basic Info
    return {
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


# Assign ID
def id_assignment(db_client, table_name):
    """

    :param db_client: DynamoDB Client
    :param table_name: Wine Table Name
    :return: Assigned ID
    """
    response = db_client.describe_table(TableName=table_name)

    # Current total Num of items
    cur_count = response['Table']['ItemCount']
    # Possible ID to be assigned - From cur_count + 1
    pending_id = cur_count + 1

    # If pending_id not in Table, assign it, otherwise try pending_id += 1
    # Assigned flag set to false
    assigned = False
    while not assigned:
        # Query with pending_id
        try:
            response = db_client.query(TableName=table_name,
                                       KeyConditionExpression="ID = :id",
                                       ExpressionAttributeValues={':id': {'N': str(pending_id)}})
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            # If pending_id not in Table
            if 'Items' in response.keys() and len(response['Items']) == 0:
                assigned = True
            # If pending_id in Table
            elif 'Items' in response.keys() and len(response['Items']) > 0:
                pending_id += 1

    return str(pending_id)
