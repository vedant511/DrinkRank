"""
Fetcher of Completed Beverage requests for DrinkRank
- Query the Database to get all the beverages for which a request was completed in the past for status change. 
Pass the results to the front end to display to the admins so that they can take required action
- Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
from boto3.dynamodb.conditions import Key, Attr
from operator import itemgetter


def fetch_completed_requests(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. status - Current status value of the beverages which admins wish to see (list of strings) 
                      2. page_num - paging of beverage list
                      3. num - num of beverages to show in one page
                      4. sort - field by which to sort the beverages
                      5. order - order by which to sort the beverages on sort field (True:Desc, False:Asc)
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: List of dictionaries containing the required beverages, each dictionary containing a separate 
        beverage record
    """
    print event
    # Get the input event fields
    page = 1
    sort_key = 'ID'
    n = 10
    order = False

    if event['page_num'] is not None:
        page = event['page_num']
    if event['sort'] is not None and event['sort'] != "null":
        sort_key = event['sort']
    if event['num'] is not None:
        n = event['num']
    if event['order'] is not None:
        order = event['order']
        
    status = event['Status']

    # Connect with the dynamodb either locally or in aws server
    # Local
    # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")
    # Server
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

    # Select the table to work with
    table = dynamodb.Table('Wines')

    # Get the beverages having status as PA(Pending Addition), PD(Pending Deletion), PU(Pending Update)
    # sorted based on requested field and order
    result = []
    
    status_list = status.split(",")

    for st in status_list:
        bvgs = table.scan(FilterExpression=(Attr('Status').eq(str(st))))['Items']
        result.extend(bvgs)

    sorted_bvgs = sorted(result, key=itemgetter(sort_key), reverse=order)

    # Calculate the starting and ending wine record needed based on the requested page number and number of items
    start = (page - 1) * n
    end = start + n

    # Return the fetched items
    return sorted_bvgs[start:end]
