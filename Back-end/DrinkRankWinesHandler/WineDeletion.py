"""
Wine Deletion Function for DrinkRank
- Extract Wine's primary key
- Delete the item in the database if it exists

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3
from botocore.exceptions import ClientError
from datetime import datetime

# Global pending deletion token
deletion_token = 'PD'
# Global Wine Table Name
wine_table = 'Wines'


def deletion_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return:
    """

    # Get the Primary Key of the Wine
    wine_id = event['wineID']

    # DynamoDB Client
    db_client = boto3.client('dynamodb')

    # Try - Exception - Else Block
    try:
        # Try to delete the item
        # Get Current time
        cur_time = datetime.now().strftime("%Y%m%d %H:%M:%S")
        # Currently, using UPDATE and Set Status to 'D' instead of directly deleting
        response = db_client.update_item(TableName=wine_table,
                                         Key={'ID' : {'N': wine_id}},
                                         UpdateExpression="SET #ST = :s, #TS_ST = :ts",
                                         ExpressionAttributeNames={
                                             '#ST' : 'Status',
                                             '#TS_ST' : 'TimeStampStatusChange'
                                         },
                                         ExpressionAttributeValues={
                                             ':s' : {'S' : deletion_token},
                                             ':ts' : {'S' : cur_time}
                                             },
                                         ReturnValues='UPDATED_NEW')
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print(e.response['Error']['Message'])
        raise Exception("Bad Request: Deletion Failed.")
    else:
        # Deletion Succeeded
        # Response will contain - {'Attributes': {'Status': {'S': 'PD'}}
        if response['Attributes']['Status']['S'] == deletion_token:
            return {
                'Message': 'Deletion Succeeded'
            }

    raise Exception("Bad Request: Deletion Failed.")
