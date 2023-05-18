#!/usr/bin/python3
## Script to convert excel-style CSV to a geojson  file -- used by "Site Work Plans" and "Producers & Consumers"

import sys
import csv
import json

arg1 = sys.argv[1]


def row2feature(r):
    # change "foo ,bar  ,baz" to an array [ "foo", "bar", "baz" ]
    def csv_array( line,sep=','):
        array = [ y.strip() for y in line.split(sep) ]
        return json.dumps(array)

    # change \n to \\n because json does not allow multiple lines
    quote_nl = lambda x: x.replace('\n','\\n')

    template  = f"""    {{
      "type": "Feature",
      "properties": {{
        "ID": "{r['ID']}",
        "Name (EN)": "{r['Name (EN)'].strip()}",
        "Name (CY)": "{r['Name (CY)'].strip()}",
        "Address": "{r['Address'].strip()}",
        "Longitude": "{r['Longitude']}",
        "Latitude": "{r['Latitude']}",
        "Area": "{r['Area'].strip()}",
        "Work Package": "{r['Work Package']}",
        "Keywords (EN)": {csv_array(r['Keywords (EN)'])},
        "Keywords (CY)": {csv_array(r['Keywords (CY)'])},
        "Description (EN)": "{quote_nl(r['Description (EN)'])}",
        "Description (CY)": "{quote_nl(r['Description (CY)'])}",
        "Picture title": {csv_array(r['Picture title'],'|')},
        "Photos": {csv_array(r['Photos'])},
        "Contact name": "{r['Contact name'].strip()}",
        "Telephone": "{r['Telephone']}",
        "Email": "{r['Email'].strip()}",
        "Website": "{r['Website']}",
        "Facebook": "{r['Facebook']}",
        "Role": "{r['Role']}",
        "Notes": "{r['Notes']}"
      }},
      "geometry": {{
        "type": "Point",
        "coordinates": [
          {r['Longitude']},
          {r['Latitude']}
        ]
      }}
    }}
    """
    return template

    
with open(arg1,"r") as csv_file:
    reader = csv.DictReader(csv_file)

    features = map(row2feature, reader)
    print (f"""{{
      "type": "FeatureCollection",
      "features": [
          { (',').join(features) }
]}}
    """)
