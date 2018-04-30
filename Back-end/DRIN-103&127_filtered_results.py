"""
Beverage Search Functionality for DrinkRank
- Receive the filters applied and search term entered by the user from front end
- Query the Database to get Beverages based on above rules and pass it back to the front end to display to the user
Author: Vedant Sharma (Vedant.Sharma@asu.edu)
"""


import boto3  # AWS SDK for Python
from boto3.dynamodb.conditions import Key, Attr
from operator import itemgetter
import datetime
import sys

now = datetime.datetime.now()


def get_filtered_results(event, context):

    """
        :param event: Event data passed by AWS Lambda, it is of the Python dict type.
                      (It can also be list, str, int, float, or NoneType type).
                      For this function, event dict will consist of following keys:
                      1. term - Text entered in beverage search text box 
                      2. manufacturer - Text entered in manufacturer search text box filter
                      3. num - num of wines to show in one page
                      4. sort - field by which to sort the wines
                      5. order - order by which to sort the wines on sort field (True:Desc, False:Asc)
                      6. Sweetness - Filter value selected for Sweetness
                      7. Bitterness - Filter value selected for Bitterness
                      8. Sourness - Filter value selected for Sourness
                      9. Alcohol - Filter value selected for Alcohol
                      10. Rating - Filter value selected for Rating
                      11. Vintage - Filter value selected for Vintage
                      12. Price - Filter value selected for Price
                      13. page_num - selected page in paging of results 
        :param context: Runtime information provided by AWS Lambda, it is of the LambdaContext type.
                        This function doesn't need any value for this param for now. An empty string would suffice.
        :return: list of dictionaries containing results fetched based on filters and keywords. Each dict will contain
                a different wine
    """

    # Declare the defaults
    page = 1
    sort_key = 'Rating'
    n = 10
    order = True
    sweet_low = 1
    sour_low = 1
    bitter_low = 1
    alc_low = 0
    rating_low = 1
    vintage_low = 0
    price_low = 0
    sweet_high = 10
    sour_high = 10
    bitter_high = 10
    alc_high = 100
    rating_high = 5
    vintage_high = now.year
    price_high = sys.maxint

    term = None
    manufacturer = None

    # Get the input event fields

    if event['page_num'] is not None:
        page = event['page_num']

    if event['sort'] is not None and event['sort'] != "" and event['sort'] != "null":
        sort_key = event['sort']

    if event['num'] is not None:
        n = event['num']

    if event['order'] is not None:
        order = event['order']

    if event['term'] is not None and event['term'] != "" and event['term'] != "null":
        term = event['term']

    if event['manufacturer'] is not None and event['manufacturer'] != "" and event['manufacturer'] != "null":
        manufacturer = event['manufacturer']

    if event['Sweetness'] is not None:
        sweet_low = sweet_high = event['Sweetness']

    if event['Sourness'] is not None:
        sour_low = sour_high = event['Sourness']

    if event['Bitterness'] is not None:
        bitter_low = bitter_high = event['Bitterness']

    if event['Alcohol'] is not None:
        alc_low = alc_high = event['Alcohol']

    if event['Rating'] is not None:
        rating_low = rating_high = event['Rating']

    if event['Vintage'] is not None:
        vintage_low = vintage_high = event['Vintage']

    if event['Price'] is not None:
        price_low = price_high = event['Price']

    # Connect with the dynamodb either locally or in aws server. If testing, use the locally downloaded dynamodb
    # by uncommenting line 6 and commenting line 8, else vice-versa'''
    # dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")  # Local
    dynamodb = boto3.resource('dynamodb', region_name='us-west-2')  # Server

    # Select the table to work with
    table = dynamodb.Table('Wines')

    # Construct the filter expression

    if term:
        if term.lower() in ['sweet', 'bitter', 'sour']:
            if term.lower() == 'sweet':
                if manufacturer:
                    filter_expression = (Attr('ManufacturerName').begins_with(manufacturer) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.title()) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.lower())) & \
                                        Attr('Sweetness').between(6, 10) & \
                                        Attr('Sourness').between(sour_low, sour_high) & \
                                        Attr('Bitterness').between(bitter_low, bitter_high) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

                else:
                    filter_expression = Attr('Sweetness').between(6, 10) & \
                                        Attr('Sourness').between(sour_low, sour_high) & \
                                        Attr('Bitterness').between(bitter_low, bitter_high) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

            elif term.lower() == 'sour':
                if manufacturer:
                    filter_expression = (Attr('ManufacturerName').begins_with(manufacturer) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.title()) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.lower())) & \
                                        Attr('Sweetness').between(sweet_low, sweet_high) & \
                                        Attr('Sourness').between(6, 10) & \
                                        Attr('Bitterness').between(bitter_low, bitter_high) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

                else:
                    filter_expression = Attr('Sweetness').between(sweet_low, sweet_high) & \
                                        Attr('Sourness').between(6, 10) & \
                                        Attr('Bitterness').between(bitter_low, bitter_high) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

            else:
                if manufacturer:
                    filter_expression = (Attr('ManufacturerName').begins_with(manufacturer) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.title()) | Attr(
                                            'ManufacturerName').begins_with(manufacturer.lower())) & \
                                        Attr('Sweetness').between(sweet_low, sweet_high) & \
                                        Attr('Sourness').between(sour_low, sour_high) & \
                                        Attr('Bitterness').between(6, 10) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

                else:
                    filter_expression = Attr('Sweetness').between(sweet_low, sweet_high) & \
                                        Attr('Sourness').between(sour_low, sour_high) & \
                                        Attr('Bitterness').between(6, 10) & \
                                        Attr('Alcohol').between(alc_low, alc_high) & \
                                        Attr('Price').between(price_low, price_high) & \
                                        Attr('Rating').between(rating_low, rating_high) & \
                                        Attr('Vintage').between(vintage_low, vintage_high) & \
                                        Attr('Status').eq('A')

        else:
            if manufacturer:
                filter_expression = (Attr('Name').begins_with(term) | Attr('Name').begins_with(term.title()) | Attr('Name').begins_with(term.lower())) & \
                                    (Attr('ManufacturerName').begins_with(manufacturer) | Attr('ManufacturerName').begins_with(manufacturer.title()) | Attr('ManufacturerName').begins_with(manufacturer.lower())) & \
                                    Attr('Sweetness').between(sweet_low, sweet_high) & \
                                    Attr('Sourness').between(sour_low, sour_high) & \
                                    Attr('Bitterness').between(bitter_low, bitter_high) & \
                                    Attr('Alcohol').between(alc_low, alc_high) & \
                                    Attr('Price').between(price_low, price_high) & \
                                    Attr('Rating').between(rating_low, rating_high) & \
                                    Attr('Vintage').between(vintage_low, vintage_high) & \
                                    Attr('Status').eq('A')

            else:
                filter_expression = (Attr('Name').begins_with(term) | Attr('Name').begins_with(term.title()) | Attr('Name').begins_with(term.lower())) & \
                                    Attr('Sweetness').between(sweet_low, sweet_high) & \
                                    Attr('Sourness').between(sour_low, sour_high) & \
                                    Attr('Bitterness').between(bitter_low, bitter_high) & \
                                    Attr('Alcohol').between(alc_low, alc_high) & \
                                    Attr('Price').between(price_low, price_high) & \
                                    Attr('Rating').between(rating_low, rating_high) & \
                                    Attr('Vintage').between(vintage_low, vintage_high) & \
                                    Attr('Status').eq('A')

    else:
        if manufacturer:
            filter_expression = (Attr('ManufacturerName').begins_with(manufacturer) | Attr('ManufacturerName').begins_with(manufacturer.title()) | Attr('ManufacturerName').begins_with(manufacturer.lower())) & \
                                Attr('Sweetness').between(sweet_low, sweet_high) & \
                                Attr('Sourness').between(sour_low, sour_high) & \
                                Attr('Bitterness').between(bitter_low, bitter_high) & \
                                Attr('Alcohol').between(alc_low, alc_high) & \
                                Attr('Price').between(price_low, price_high) & \
                                Attr('Rating').between(rating_low, rating_high) & \
                                Attr('Vintage').between(vintage_low, vintage_high) & \
                                Attr('Status').eq('A')

        else:
            filter_expression = Attr('Sweetness').between(sweet_low, sweet_high) & \
                                Attr('Sourness').between(sour_low, sour_high) & \
                                Attr('Bitterness').between(bitter_low, bitter_high) & \
                                Attr('Alcohol').between(alc_low, alc_high) & \
                                Attr('Price').between(price_low, price_high) & \
                                Attr('Rating').between(rating_low, rating_high) & \
                                Attr('Vintage').between(vintage_low, vintage_high) & \
                                Attr('Status').eq('A')

    # Get the wines having status as A (Approved), sorted based on requested field and order
    wines = table.scan(FilterExpression=filter_expression)['Items']
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
        new_item['ManufacturerName'] = wine['ManufacturerName']
        new_item['Vintage'] = wine['Vintage']
        new_item['Country'] = wine['Country']
        items.append(new_item)

    # Return the fetched items
    return items


# test1 = {'term': 'Sweet',
#          'manufacturer': '',
#          'num': None,
#          'sort': None,
#          'order': None,
#          'page_num': None,
#          'Sweetness': None,
#          'Bitterness': None,
#          'Sourness': None,
#          'Alcohol': None,
#          'Rating': None,
#          'Vintage': None,
#          'Price': None}

# print get_filtered_results(test1, "")
