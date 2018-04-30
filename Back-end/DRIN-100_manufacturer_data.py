"""
Manufacturer data Fetcher for DrinkRank
- Receive the EmailId of the Manufacturer clicked by the user to view its details, from the front end
- Query the Database to get that Manufacturer's data and pass it back to the front end to display to the user
Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
from boto3.dynamodb.conditions import Key
from operator import itemgetter


def get_manufacturer_data(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. EmailId - Email ID for which to get the data
                      2. page_num - paging of wines
                      3. num - num of wines to show in one page
                      4. sort - field by which to sort the wines
                      5. order - order by which to sort the wines on sort field (True:Desc, False:Asc)
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: list containing two objects. First obj is a dict containing manufacturer data. Second obj is a list of dict
                    for each wine to be sent to front end for display
    """

    # Get the input event fields
    manf_id = ""
    page = 1
    sort_key = 'Rating'
    n = 10
    order = True
    
    if event['EmailId'] is not None:
        manf_id = event['EmailId']    
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
    wines = table.scan(FilterExpression=Key('ManufacturerEmailId').eq(manf_id))['Items']
    sorted_wines = sorted(wines, key=itemgetter(sort_key), reverse=order)

    # Calculate the starting and ending wine record needed based on the requested page number and number of items
    start = (page - 1) * n
    end = start + n

    # Create the final list of dictionaries, containing required wine info as dictionaries
    items = []
    for wine in sorted_wines[start:end]:
        new_item = dict()
        new_item['ID'] = wine['ID']
        new_item['Name'] = wine['Name']
        new_item['Manufacturer'] = wine['ManufacturerName']
        new_item['Vintage'] = wine['Vintage']
        new_item['Country'] = wine['Country']
        items.append(new_item)

    # Return the fetched items
    return items


# print get_manufacturer_data({'ID': "abc@dummy1.com"}, "")
