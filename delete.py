import csv
import requests
import sys
import json

headers={'content-type':'application/json'}

with open('delete.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        print(row)
        if(row[0] != 'Identikey'):
            url='https://smith-points.herokuapp.com/delete/'+row[0]
            payload={'pass':sys.argv[1]}
            r = requests.delete(url, data = json.dumps(payload), headers=headers)
            print(str(r.status_code)+" "+row[0])