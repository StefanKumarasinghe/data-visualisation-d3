import csv

new_filename = "HEAT.csv"
original_filename = "CSV_RAW.csv"

with open(original_filename, mode='r', newline='') as input_file, \
     open(new_filename, mode='w', newline='') as output_file:

    reader = csv.DictReader(input_file)

    fieldnames = [ 'Country', 'Year', 'Value'] 

    writer = csv.DictWriter(output_file, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        if (row['UNIT'] == 'TOTPOPTX') and (row['Variable'] == 'Government/compulsory health insurance coverage'):

            country = row['Country']
            year = row['Year']
            value = float(row['Value'])  

            writer.writerow({'Country': country, 'Year': year, 'Value': value})

print("Extraction completed. New CSV file created:", new_filename)
