"""
Salt Fetching Function for Password Hashing
- Query the salt in DB with EmailId
- Pass the salt to Client

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3
from botocore.exceptions import ClientError

# Global Table Name
salt_table = 'Salts'


def salt_fetcher(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return:
    """
    # EmailId
    user_email = event['EmailId'].lower()

    # Query corresponding salt to DB
    db_client = boto3.client('dynamodb')

    # Try - Except - Else Block
    try:
        # DB Salt Query
        response = db_client.query(TableName=salt_table,
                                   KeyConditionExpression="EmailId = :id",
                                   ExpressionAttributeValues={':id': {'S': user_email}})
    except ClientError:
        raise Exception("Bad Request: Query Failed.")
    else:
        # If Items retrieved successfully
        if 'Items' in response.keys() and len(response['Items']) != 0:
            # Fetch the unique salt
            item = response['Items'][0]

            return {
                'Salt': item['Salt']['B'].decode()
            }
    # End of Try - Except - Else

    raise Exception("Bad Request: Query Failed.")
