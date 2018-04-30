"""
Top Wines Fetcher for DrinkRank based on selected field, page number in pagination, and number of items per page
- Receive selected rules by which the user requests data from front end
- Query the Database to get the results accordingly and pass them back to the front end to display to the user
Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
from boto3.dynamodb.conditions import Key
from operator import itemgetter


def get_top_wines(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. page_num - the page number to which the user navigated {Required, type=<int>}
                      2. sort - field name on which to sort the results on {Optional, Default='ID', type=<str>}
                      3. num - number of results to be displayed on a single page {Optional, Default=10, type=<int>}
                      4. order - order in which to show the sorted results {Optional, Default='False', type=<boolean>}
                                (True=Descending, False=Ascending).
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: dict containing the fetched wines from Wines Table based on conditions provided in the event param.
                Following fields will be returned for each wine
    """

    # Get the input event fields
    page = 1
    sort_key = 'ID'
    n = 10
    order = False
    
    if event['page_num'] is not None:
        page = event['page_num']
    
    if event['sort'] is not None and event['sort'] != "":
        sort_key = event['sort']
    
    if event['num'] is not None:
        n = event['num']
    
    if event['order'] is not None:
        order = event['order']

    # Connect with the dynamodb either locally or in aws server. If testing, use the locally downloaded dynamodb
    # by uncommenting line 6 and commenting line 8, else vice-versa'''
    # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")  # Local
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')  # Server

    # Select the table to work with
    table = dynamodb.Table('Wines')

    # Get the wines having status as A (Approved), sorted based on requested field and order
    wines = table.scan(FilterExpression=Key('Status').eq('A'))['Items']
    sorted_wines = sorted(wines, key=itemgetter(sort_key), reverse=order)

    # Calculate the starting and ending wine record needed based on the requested page number and number of items
    start = (page-1) * n
    end = start + n

    # Create the final list of dictionaries, containing required wine info as dictionaries
    items = []
    for wine in sorted_wines[start:end]:
        new_item = dict()
        new_item['ID'] = wine['ID']
        new_item['Name'] = wine['Name']
        new_item['ManufacturerName'] = wine['ManufacturerName']
        new_item['Vintage'] = wine['Vintage']
        new_item['Country'] = wine['Country']
        items.append(new_item)

    # Return the fetched items
    return items
