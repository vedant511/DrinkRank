"""
Login Handler for DrinkRank
- Extract User Inputs (EmailID, Password)
- Query the Database to verify

Author: Mingfei Yang (Mingfei.Yang.1@asu.edu)
"""

import boto3  # AWS SDK for Python
from botocore.exceptions import ClientError


# Main Login Handler
def login_handler(event, context):
    """

    :param event: Event data passed by AWS Lambda, it is usually of the Python dict type.
                  (It can also be list, str, int, float, or NoneType type)
    :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
    :return: dict generated by verifier function
    """
    # Get emailID, password, and (future)saveStatus
    email_id = event['email'].lower()
    key = event['password'] 
    # save = event['save']

    # Query the Database
    status = verifier(email_id, key)

    # status['saveStatus'] = save

    return status
# ----- End of LoginHandler -----


# Conduct Verification through DynamoDB
def verifier(email, pwd):
    """

    :param email: Email extracted
    :param pwd: Pwd extracted
    :return: dict: { "verification": True/False,
                     (If Login succeeded) "email": "Email of the User",
                     (If Login succeeded) "name": "Name of the User",
                     (If Login succeeded) "userGroup": "User"/"Admin"/"Manufacturer",
                     (If Login succeeded) "dob": "DOB of the User",
                     (If Login succeeded) "city": "City",
                     (If Login succeeded) "country": "Country",
                     (If Login succeeded) "phone": "Phone # of the User",
                     "message": "Message Str",
                     "authToken": "Allow"/"Deny" }
    """

    # DynamoDB Client
    db_client = boto3.client('dynamodb')

    # A set of conditions
    # If email and/or pwd is None
    if email is None or pwd is None:
        return {
            "verification": False,
            "message": "Incorrect Email or Password"
        }

    # Get Item from Users table
    try:
        response = db_client.query(TableName='Users',
                                   KeyConditionExpression="EmailId = :id",
                                   ExpressionAttributeValues={':id': {'S': email}})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        # If Items retrieved successfully
        if 'Items' in response.keys() and len(response['Items']) != 0:
            # Get the Matched Item (Should only be ONE)
            item = response['Items'][0]

            # Compare pwd
            if pwd == item['Password']['S']:
                # Get Group Info
                if item['isAdmin']['N'] == '1':
                    group = 'Admin'
                elif item['isManufacturer']['N'] == '1':
                    group = 'Manufacturer'
                else:
                    group = 'User'

                # Convert YYYYMMDD to YYYY/MM/DD
                birth_date = item['DOB']['S']
                if '/' not in item['DOB']['S']:
                    birth_date = birth_date[0:4] + '/' + birth_date[4:6] + '/' + birth_date[6:8]
                
                # Get Phone info
                phone = None
                if 'Phone' in item.keys():
                    phone = item['Phone']['S']
                
                # Get TimeStampAdded
                register_time = item['TimeStampAdded']['S']

                return {
                    "verification": True,
                    "email": email,
                    "name": item['Name']['S'],
                    "userGroup": group,
                    "dob": birth_date,
                    "city": item['City']['S'],
                    "country": item['Country']['S'],
                    "phone": phone,
                    "regTime": register_time,
                    "message": "Login Succeeded",
                    "authToken": "Allow"
                }

    # End of try - except - else block

    # Default Return
    return {
        "verification": False,
        "message": "Incorrect Email or Password",
    }
