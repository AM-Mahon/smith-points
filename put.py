import csv
import requests
import sys
import json

headers={'content-type':'application/json'}

with open('points.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        print(row)
        if(row[0] != 'Last'):
            url='https://smith-points.herokuapp.com/put/'+row[2]
            payload={'pass':sys.argv[1], 'first':row[1], 'last':row[0], 'points':row[3]}
            r = requests.put(url, data = json.dumps(payload), headers=headers)
            print(str(r.status_code)+" "+row[2])