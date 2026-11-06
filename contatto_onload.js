/* eslint-disable */
var Demo = window.Demo || window.Sdk || {};
(function () {
	'use strict';

	// OnLoad della form del contatto
	this.printContactInformation = function (executionContext) {
		var formContext = (executionContext && executionContext.getFormContext) ? executionContext.getFormContext() : executionContext;
		if (!formContext) return;

		var contactEntity = formContext.data && formContext.data.entity ? formContext.data.entity : null;
		var contactId = '';
		if (contactEntity && typeof contactEntity.getId === 'function') {
			contactId = contactEntity.getId().replace(/[{}]/g, '');
		}
		var isNewContact = contactId == null || contactId === '';

		var contactTableName = "demo_contatto";
		var contactQuery = "?$select=demo_nome,demo_email,demo_partitaiva,demo_tipologia";

		if (!isNewContact) {
			Xrm.WebApi.retrieveRecord(contactTableName, contactId, contactQuery).then(
				function success(result) {
					try {
						var contactName = result.demo_nome || '';
						var contactEmail = result.demo_email || '';
						var contactVatNumber = result.demo_partitaiva || '';
						var contactType = result.demo_tipologia || '';

						if (formContext.getAttribute && formContext.getAttribute('demo_nome')) {
							formContext.getAttribute('demo_nome').setValue(contactName);
						}
						if (formContext.getAttribute && formContext.getAttribute('demo_email')) {
							formContext.getAttribute('demo_email').setValue(contactEmail);
						}
						if (formContext.getAttribute && formContext.getAttribute('demo_partitaiva')) {
							formContext.getAttribute('demo_partitaiva').setValue(contactVatNumber);
						}
						if (formContext.getAttribute && formContext.getAttribute('demo_tipologia')) {
							formContext.getAttribute('demo_tipologia').setValue(contactType);
						}

						// Optionally refresh or save the form if needed (only if there are dirty changes)
						if (formContext.data && formContext.data.entity && typeof formContext.data.entity.save === 'function') {
							try {
								var canCheckDirty = typeof formContext.data.entity.getIsDirty === 'function';
								var isDirty = canCheckDirty ? formContext.data.entity.getIsDirty() : true;
								if (isDirty) {
									var saveResult = formContext.data.entity.save();
									if (saveResult && typeof saveResult.then === 'function') {
										saveResult.catch(function (e) {
											// Don't surface error when there are no dirty changes
											console.warn('Save rejected:', e);
										});
									}
								}
							} catch (e) {
								console.warn('Save call skipped or failed:', e);
							}
						}
					} catch (e) {
						console.error('Error applying contact data:', e);
					}
				},
				function error(err) {
					console.error('Failed to retrieve contact record:', err);
				}
			);
		}
	};


	// Expose the namespace and a couple of aliases so Dynamics can call the function
	window.Demo = Demo;
	window.Sdk = Demo;
	window.printContactInformation = Demo.printContactInformation;
	window.Demo_printContactInformation = Demo.printContactInformation;

}).call(Demo);

