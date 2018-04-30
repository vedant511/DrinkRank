"""
Wine data Fetcher for DrinkRank
- Receive the ID of the wine clicked by the user to view its details, from the front end
- Query the Database to get that wine's data and pass it back to the front end to display to the user
Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
from boto3.dynamodb.conditions import Key
from operator import itemgetter


def get_wine_data(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. ID - Wine ID for which to get the data
                      2. page_num - paging of reviews
                      3. num - num of reviews to show in one page
                      4. sort - field by which to sort the reviews
                      5. order - order by which to sort the reviews on sort field (True:Desc, False:Asc)
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: list containing two objects. First obj is a dict containing wine data. Second obj is a list of dict
                    for each review sent to front end for display
    """

    # Get the input event fields
    wine_id = None
    if event['ID'] is not None:
        wine_id = event['ID']

    # Connect with the dynamodb either locally or in aws server. If testing, use the locally downloaded dynamodb
    # by uncommenting line 6 and commenting line 8, else vice-versa'''
    # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")  # Local
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')  # Server

    # Select the table to work with
    table = dynamodb.Table('Wines')

    # Get the wines having status as A (Approved), sorted based on requested field and order
    wine = table.get_item(Key={'ID': wine_id})['Item']
    reviews, mean_sweet, mean_sour, mean_bitter, mean_star = fetch_reviews(wine_id, event)

    # Changing values to current running average
    wine['Sweetness'] = mean_sweet
    wine['Sourness'] = mean_sour
    wine['Bitterness'] = mean_bitter
    wine['Rating'] = mean_star

    # Create the final list of dictionaries, containing required wine info as dictionaries
    item = [wine, reviews]

    # Return the fetched items
    return item


def fetch_reviews(wine_id, event):
    # Connect with the dynamodb either locally or in aws server. If testing, use the locally downloaded dynamodb
    # by uncommenting line 6 and commenting line 8, else vice-versa'''
    # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")  # Local
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')  # Server
    table = dynamodb.Table('Reviews')

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

    reviews = table.scan(FilterExpression=Key('Beverage ID').eq(wine_id))['Items']
    sorted_reviews = sorted(reviews, key=itemgetter(sort_key), reverse=order)

    # Get the average tastes and rating from all reviews
    sweet = 0
    sour = 0
    bitter = 0
    star = 0
    total = len(reviews)

    for review in reviews:
        sweet += review['SweetnessFelt']
        sour += review['SournessFelt']
        bitter += review['BitternessFelt']
        star += review['Stars']

    avg_sweet = round(sweet/total, 1)
    avg_sour = round(sour/total, 1)
    avg_bitter = round(bitter/total, 1)
    avg_star = round(star/total, 1)

    # Calculate the starting and ending wine record needed based on the requested page number and number of items
    start = (page - 1) * n
    end = start + n

    return sorted_reviews[start:end], avg_sweet, avg_sour, avg_bitter, avg_star


# print get_wine_data({'ID': 4, 'page_num': None, 'sort': None, 'num': None, 'order': None}, "")
