/* =====================================================================
   MERCE - Seconda funzione
   ---------------------------------------------------------------------
   All'OnChange del PREZZO DI VENDITA di una merce, stampa in console
   il NOME di tutte le merci che hanno lo stesso prezzo di vendita.

   Metodo: RetrieveMultiple  ->  Xrm.WebApi.retrieveMultipleRecords
   (a differenza della prima funzione, qui i record da ricavare sono piu' di uno)
   ===================================================================== */

var Merce = window.Merce || {};

(function () {
    "use strict";

    /* ---------------------------------------------------------------
       NOMI LOGICI - ambiente di sviluppo (publisher prefix: demo)
       --------------------------------------------------------------- */
    var ENTITY_LOGICAL_NAME = "demo_merce";            // tabella Merce
    var FIELD_PRICE         = "demo_prezzovendita";    // campo Prezzo vendita
    var FIELD_NAME          = "demo_nameprodotto";     // campo Name prodotto
    var FIELD_ID            = ENTITY_LOGICAL_NAME + "id"; // chiave primaria (es. new_merceid)

    /**
     * Da registrare sull'evento OnChange del campo "Prezzo di vendita".
     * IMPORTANTE: spuntare "Passa il contesto di esecuzione come primo parametro".
     * @param {Xrm.Events.EventContext} executionContext
     */
    Merce.onChangePrezzoVendita = function (executionContext) {

        var formContext = executionContext.getFormContext();

        // 1) Leggo il valore del prezzo di vendita appena modificato
        var priceAttr = formContext.getAttribute(FIELD_PRICE);
        if (!priceAttr) {
            console.warn("Il campo '" + FIELD_PRICE + "' non e' presente sul form.");
            return;
        }

        var prezzo = priceAttr.getValue();
        if (prezzo === null || prezzo === undefined) {
            console.log("Prezzo di vendita vuoto: nessuna ricerca eseguita.");
            return;
        }

        // 2) Id del record corrente, per non stampare la merce su cui sto lavorando.
        //    Su un record nuovo (non ancora salvato) getId() restituisce stringa vuota.
        var currentId = formContext.data.entity.getId()
                                   .replace(/[{}]/g, "")
                                   .toLowerCase();

        // 3) Query OData: seleziono solo il Nome, filtro sul prezzo di vendita
        var options = "?$select=" + FIELD_NAME +
                      "&$filter=" + FIELD_PRICE + " eq " + prezzo +
                      "&$orderby=" + FIELD_NAME + " asc";

        // 4) RetrieveMultiple: piu' record da ricavare
        Xrm.WebApi.retrieveMultipleRecords(ENTITY_LOGICAL_NAME, options).then(
            function success(result) {

                var merci = result.entities.filter(function (m) {
                    var id = m[FIELD_ID];
                    return !(currentId && id && id.toLowerCase() === currentId);
                });

                console.log("=== Merci con prezzo di vendita = " + prezzo +
                            " -> trovate: " + merci.length + " ===");

                if (merci.length === 0) {
                    console.log("Nessun'altra merce con questo prezzo di vendita.");
                    return;
                }

                merci.forEach(function (merce, i) {
                    console.log((i + 1) + ") " + merce[FIELD_NAME]);
                });
            },
            function error(err) {
                console.error("Errore nel RetrieveMultiple delle merci: " + err.message);
            }
        );
    };

    /* ---------------------------------------------------------------
       VARIANTE CON FETCHXML (stesso risultato)
       Utile se il docente chiede esplicitamente la FetchXML.
       Registrare questa al posto di quella sopra.
       --------------------------------------------------------------- */
    Merce.onChangePrezzoVendita_Fetch = function (executionContext) {

        var formContext = executionContext.getFormContext();
        var prezzo = formContext.getAttribute(FIELD_PRICE).getValue();
        if (prezzo === null || prezzo === undefined) { return; }

        var fetchXml =
            "<fetch>" +
              "<entity name='" + ENTITY_LOGICAL_NAME + "'>" +
                "<attribute name='" + FIELD_NAME + "' />" +
                "<filter>" +
                  "<condition attribute='" + FIELD_PRICE + "' operator='eq' value='" + prezzo + "' />" +
                "</filter>" +
                "<order attribute='" + FIELD_NAME + "' />" +
              "</entity>" +
            "</fetch>";

        Xrm.WebApi.retrieveMultipleRecords(ENTITY_LOGICAL_NAME, "?fetchXml=" + encodeURIComponent(fetchXml)).then(
            function success(result) {
                console.log("=== Merci con prezzo " + prezzo + ": " + result.entities.length + " ===");
                result.entities.forEach(function (m) {
                    console.log(m[FIELD_NAME]);
                });
            },
            function error(err) {
                console.error(err.message);
            }
        );
    };

})();