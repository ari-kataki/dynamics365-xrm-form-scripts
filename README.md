# Dynamics 365 form scripts

A few JavaScript web resources for Dynamics 365 / Power Apps model-driven forms, plus a small HTML page to try one of them outside Dynamics. I wrote them while learning how to script forms with `Xrm.WebApi`.

All the table and column names (`demo_...`) and the `Demo` namespace are placeholders. The original publisher prefix and environment name were removed, so to use these on a real environment replace them with your own logical names.

## Files
- `contatto_primo_esempio.js`: my very first script (Sep 2026), the simplest one. Reads a lookup field of the form (`new_fieldname` is a placeholder), takes the id of the contact and calls `retrieveRecord`, then logs the result in the console.
- `contatto_onload.js`: OnLoad of the contact form. Reads the record with `retrieveRecord` and writes the values back into the form fields.
- `merce_prezzo_vendita.js`: OnChange of a price field. Uses `retrieveMultipleRecords` (OData, plus a FetchXML variant) to log the other records with the same price.
- `preventivo_rilascio_ordine.js`: command bar button on a quote. Creates a purchase order or a sales order (header + lines) depending on the quote type.
- `test_harness.html`: fake `Xrm.WebApi` and a fake form context so `contatto_onload.js` can be run in a normal browser.

## How to run
- The scripts: upload them as web resources and register the function on the right event or button (the function names are in the comments at the top of each file). Tick "pass execution context as first parameter" for the OnChange / OnLoad handlers.
- The harness: put `test_harness.html` and `contatto_onload.js` in the same folder and open the HTML file in a browser.

## Known issues
- Not tested against a real environment, only `contatto_onload.js` can be run in the harness. The table and column names are placeholders (see above).
- `preventivo_rilascio_ordine.js` is unfinished: the order name is still `"TODO"` and there is no error handling.

## Notes
- Comments are in Italian, they are my own study notes.
- Stack: JavaScript, Dynamics 365 / Dataverse Web API, HTML.
