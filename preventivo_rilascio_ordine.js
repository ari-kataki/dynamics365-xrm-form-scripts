/* =====================================================================
   PREVENTIVO -> ORDINE  (pulsante "Rilascio ordine")
   Acquisto -> Ordine d'acquisto | Vendita -> Ordine di Vendita
   ===================================================================== */

var Demo = Demo || {};

Demo.Preventivo = new function ()
{
    var self = this;

    // valori della choice Tipologia (controllare in Choices!)
    var TIPOLOGIA_ACQUISTO = 1;
    var TIPOLOGIA_VENDITA = 2;

    /* -----------------------------------------------------------------
       Funzione del pulsante. Parametro del comando: PrimaryControl
       ----------------------------------------------------------------- */
    this.rilascioOrdine = async function (formContext)
    {
        var quoteId = formContext.data.entity.getId().replace(/[{}]/g, '');
        var quote = await Xrm.WebApi.retrieveRecord("demo_preventivo", quoteId);

        var orderId;

        if (quote.demo_tipologia === TIPOLOGIA_ACQUISTO)
        {
            orderId = await self.createPurchaseOrderHeader(quoteId);
            await self.createPurchaseOrderLines(quoteId, orderId);
        }
        else if (quote.demo_tipologia === TIPOLOGIA_VENDITA)
        {
            orderId = await self.createSalesOrderHeader(quoteId);
            await self.createSalesOrderLines(quoteId, orderId);
        }
        else
        {
            console.log("Tipologia del preventivo non valorizzata");
            return;
        }

        console.log("Ordine creato: " + orderId);
    };

    /* -----------------------------------------------------------------
       ORDINE D'ACQUISTO
       ----------------------------------------------------------------- */
    this.createPurchaseOrderHeader = async function (quoteId)
    {
        var quote = await Xrm.WebApi.retrieveRecord("demo_preventivo", quoteId);

        var purchaseOrderValue =
        {
            "demo_Riferimentopreventivo@odata.bind": "/demo_preventivos(" + quoteId + ")",
            "demo_nomeordine": "TODO", // creare un nome sensato
            "demo_dataordine": new Date().toISOString(),
            "demo_Contatto@odata.bind": "/contacts(" + quote._demo_contatto_value + ")",
            "demo_Indirizzo@odata.bind": "/demo_indirizzos(" + quote._demo_indirizzo_value + ")",
            "demo_totaleordine": quote.demo_totale,
            "demo_costospedizione": quote.demo_costospedizione
        };

        var purchaseOrder = await Xrm.WebApi.createRecord("demo_ordinedacquisto", purchaseOrderValue);
        var purchaseOrderId = purchaseOrder.id.replace(/[{}]/g, '');

        return purchaseOrderId;
    };

    this.createPurchaseOrderLines = async function (quoteId, purchaseOrderId)
    {
        var quoteLines = await Xrm.WebApi.retrieveMultipleRecords("demo_rigapreventivo",
            "?$filter=_demo_preventivo_value eq " + quoteId);

        for (var i = 0; i < quoteLines.entities.length; i++)
        {
            var quoteLine = quoteLines.entities[i];

            var purchaseOrderLineValue =
            {
                "demo_Ordine@odata.bind": "/demo_ordinedacquistos(" + purchaseOrderId + ")",
                "demo_Merce@odata.bind": "/demo_merces(" + quoteLine._demo_merce_value + ")",
                "demo_Magazzino@odata.bind": "/demo_magazzinos(" + quoteLine._demo_magazzino_value + ")",
                "demo_quantita": quoteLine.demo_quantita,
                "demo_prezzounitario": quoteLine.demo_prezzounitario,
                "demo_subtotale": quoteLine.demo_subtotale
            };

            await Xrm.WebApi.createRecord("demo_rigaordinedacquisto", purchaseOrderLineValue);
        }
    };

    /* -----------------------------------------------------------------
       ORDINE DI VENDITA
       ----------------------------------------------------------------- */
    this.createSalesOrderHeader = async function (quoteId)
    {
        var quote = await Xrm.WebApi.retrieveRecord("demo_preventivo", quoteId);

        var salesOrderValue =
        {
            "demo_Riferimentopreventivo@odata.bind": "/demo_preventivos(" + quoteId + ")",
            "demo_nomeordine": "TODO", // creare un nome sensato
            "demo_dataordine": new Date().toISOString(),
            "demo_Contatto@odata.bind": "/contacts(" + quote._demo_contatto_value + ")",
            "demo_Indirizzo@odata.bind": "/demo_indirizzos(" + quote._demo_indirizzo_value + ")",
            "demo_totaleordine": quote.demo_totale,
            "demo_costospedizione": quote.demo_costospedizione
        };

        var salesOrder = await Xrm.WebApi.createRecord("demo_ordinedivendita", salesOrderValue);
        var salesOrderId = salesOrder.id.replace(/[{}]/g, '');

        return salesOrderId;
    };

    this.createSalesOrderLines = async function (quoteId, salesOrderId)
    {
        var quoteLines = await Xrm.WebApi.retrieveMultipleRecords("demo_rigapreventivo",
            "?$filter=_demo_preventivo_value eq " + quoteId);

        for (var i = 0; i < quoteLines.entities.length; i++)
        {
            var quoteLine = quoteLines.entities[i];

            var salesOrderLineValue =
            {
                "demo_Ordine@odata.bind": "/demo_ordinedivenditas(" + salesOrderId + ")",
                "demo_Merce@odata.bind": "/demo_merces(" + quoteLine._demo_merce_value + ")",
                "demo_Magazzino@odata.bind": "/demo_magazzinos(" + quoteLine._demo_magazzino_value + ")",
                "demo_quantita": quoteLine.demo_quantita,
                "demo_prezzounitario": quoteLine.demo_prezzounitario,
                "demo_subtotale": quoteLine.demo_subtotale
            };

            await Xrm.WebApi.createRecord("demo_rigaordinedivendita", salesOrderLineValue);
        }
    };
};

/* =====================================================================
   REGISTRAZIONE DEL PULSANTE
   Function:  Demo.Preventivo.rilascioOrdine
   Parameter: PrimaryControl
   ===================================================================== */
