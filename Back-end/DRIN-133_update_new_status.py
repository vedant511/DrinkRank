"""
Code to update status of a beverage as per the admin's response to a request
- Obtain the ID of the beverage and response of admin from the front-end
- Query the Database to get beverage from that ID and update its status in the table as per admin's response 
- Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
import datetime
import time


def update_status_new(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. ID - ID of the beverage for which to update the status
                      2. Status - Response to request sent by the Admin (Approve/Cancel) <type 'str'>
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: False with an error message if there occurs any exception while updating the status, else True.
    """

    # Get the input event fields
    ID = event['ID']
    action = event['action']
    response = ""

    if ID is None or action is None:
        response = "Please send both ID and the action you want to perform"

    else:
        # Connect with the dynamodb either locally or in aws server
        # Local
        # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")
        # Server
        dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

        # Select the table to work with
        table = dynamodb.Table('Wines')

        # Get the beverages having status as PA(Pending Addition), PD(Pending Deletion), PU(Pending Update)
        # sorted based on requested field and order
        bvg = table.get_item(Key={'ID': ID})['Item']
        curr_status = bvg['Status']
        try:
            if action == "Approve":
                if curr_status == "PA":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'A',
                                             ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

                if curr_status == "PD":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'D',
                                             ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

                if curr_status == "PU":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'U',
                                             ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

            if action == "Cancel":
                if curr_status == "PA":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'CA',
                                              ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

                if curr_status == "PD":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'CD',
                                              ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

                if curr_status == "PU":
                    resp = table.update_item(Key={'ID': ID},
                                             UpdateExpression="SET #Status = :s, TimeStampStatusChange = :t",
                                             ExpressionAttributeNames={'#Status': 'Status'},
                                             ExpressionAttributeValues=
                                             {':s': 'CU',
                                              ':t': datetime.datetime.fromtimestamp(
                                                      time.time()).strftime('%Y%m%d %H:%M:%S')})

                    if resp['ResponseMetadata']['HTTPStatusCode'] == 200:
                        response = "Success"
                        # Notify the Manufacturer about it here

        except Exception as e:
            response = e

    # Return the fetched items
    return {'response': response}
