"""
Password Hashing Function for DrinkRank
- Generate salt for a password
- Do hashing
- Store hashed pwd and salt into DB

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import bcrypt
import boto3
from botocore.exceptions import ClientError


# Global - Table Name for storing salt and hashed pwd
salt_table = 'Salts'
user_table = 'Users'


def hashing_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return:
    """

    # Get User Email
    user_email = event['EmailId'].lower()
    # Password - Encode as bytes
    pwd = event['Password'].encode()
    # Random salt generated for a password - bytes type
    # 10 Rounds, default is 12
    salt = bcrypt.gensalt(10)
    # Hashing
    hashed_pwd = bcrypt.hashpw(pwd, salt)

    # Trying to store in DB
    db_client = boto3.client('dynamodb')
    # Try - Except Block
    try:
        # Salt Table - Salt insertion
        response_salt = db_client.put_item(TableName=salt_table,
                                           Item={
                                               'EmailId': {'S': user_email},
                                               'Salt': {'B': salt}
                                           })
        # User Table - Hashed pwd Update
        update_expr = "SET " + "#PWD = :pwd"
        response_pwd = db_client.update_item(TableName=user_table,
                                             Key={'EmailId': {'S': user_email}},
                                             UpdateExpression=update_expr,
                                             ExpressionAttributeNames={
                                                 '#PWD': 'Password'
                                             },
                                             ExpressionAttributeValues={
                                                 ':pwd': {'S': hashed_pwd.decode()}
                                             },
                                             ReturnValues='UPDATED_NEW')
    except ClientError:
        raise Exception("Bad Request: Posting Failed.")

    return {
        'Message': 'Hashing Completed.'
    }
