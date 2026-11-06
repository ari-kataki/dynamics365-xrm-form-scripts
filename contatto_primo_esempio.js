var ITSFUNCTION = window.ITSFUNCTION || {};
(function (ITSFUNCTION) {
    
    this.primoEsempio = function(executionContext){
        var formContext = executionContext.getFormContext();

        var tabellaContatto = "demo_contatto";

        var contatto = formContext.getAttribute("new_fieldname").getValue();
        if (!contatto || contatto.length === 0) {
            console.log("Lookup field 'new_fieldname' is empty or null");
            return;
        }
        var idContatto = contatto[0].id.replace(/[{}]/g, '');

        Xrm.WebApi.retrieveRecord(tabellaContatto, idContatto).then(
            function successCallback(record) {
                console.log("Record retrieved: " + record.id);
            },
            function errorCallback(error) {
                console.log(error);
            }
        );
    }
}).call(ITSFUNCTION);   