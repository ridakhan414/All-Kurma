/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

 define(['N/currentRecord', 'N/ui/dialog', 'N/record', 'N/search', '../GlobalUtil/moment'],
 function (nsCurrentRec, dialog, record, search, moment) {
     var linkArray = []

     function pageInit(context) {

         try {
             var currentRecord = nsCurrentRec.get();
             var currentRecordType = currentRecord.type;

             if (currentRecordType == "salesorder" || currentRecordType == "cashsale" || currentRecordType == "itemfulfillment" || currentRecordType == "invoice" || currentRecordType == "workorder" || currentRecordType == "transferorder") {

                 console.log("Running Script : PS_CS_GetInventoryDetails.js | Event : pageInit")


                 // alert("hellooo world")
                 window.sessionStorage.removeItem('entityPageinit')
                 window.sessionStorage.removeItem('trandatePageinit')
                 window.sessionStorage.removeItem('locationPageinit')
                 window.sessionStorage.removeItem('createdfromPageinit')
                 window.sessionStorage.removeItem('createdfromIDPageinit')
                 window.sessionStorage.removeItem('entityFieldChange')
                 window.sessionStorage.removeItem('trandateFieldChange')
                 window.sessionStorage.removeItem('locationFieldChange')

                 window.sessionStorage.removeItem('currentRecordType')


                 console.log("currentRecordType", currentRecordType)
                 window.sessionStorage.setItem("currentRecordType", currentRecordType);

                 var entityID = currentRecord.getValue(
                     {
                         fieldId: 'entity'
                     }
                 )
                 window.sessionStorage.setItem("entityPageinit", entityID);
                 console.log("entity", window.sessionStorage.getItem("entityPageinit"))


                 var tranDate = currentRecord.getValue(
                     {
                         fieldId: 'trandate'
                     }
                 )
                 window.sessionStorage.setItem("trandatePageinit", tranDate);
                 console.log("tranDate", window.sessionStorage.getItem("trandatePageinit"))



                 if (currentRecordType == 'itemfulfillment') {

                     var location = currentRecord.getCurrentSublistValue({
                         sublistId: 'item',
                         fieldId: 'location'
                     });

                     var createdfrom = currentRecord.getText(
                         {
                             fieldId: 'createdfrom'
                         }
                     )

                     var createdfromID = currentRecord.getValue(
                         {
                             fieldId: 'createdfrom'
                         }
                     )

                     window.sessionStorage.setItem("createdfromPageinit", createdfrom);
                     window.sessionStorage.setItem("createdfromIDPageinit", createdfromID);
                     //console.log("createdfrom", window.sessionStorage.getItem("createdfrom"))

                 }

                 else if (currentRecord.type == 'transferorder') {

                     var location = currentRecord.getValue({
                         fieldId: 'transferlocation'
                     });
                 } else {
                     var location = currentRecord.getValue(
                         {
                             fieldId: 'location'
                         }
                     )

                 }
                 window.sessionStorage.setItem("locationPageinit", location);
                 console.log("location", window.sessionStorage.getItem("locationPageinit"))
             }

         }
         catch (e) {
             log.debug('Error occured: ' + e.message);

         }

         return true;
     }

     function fieldChanged(context) {
         try {

             var currentRecord = context.currentRecord;
             var currentRecordType = currentRecord.type;
             var fieldId = context.fieldId
             var sublistName = context.sublistId;
             var sublistFieldName = context.fieldId;
             var locationID, locationCategory, isDemandSeason, customerInLocation;


             if (currentRecord.type == 'cashsale' || currentRecord.type == 'salesorder' || currentRecord.type == 'itemfulfillment' || currentRecord.type == "invoice" || currentRecord.type == "workorder" || currentRecord.type == "transferorder") {


                 if (fieldId == 'entity') {


                     var customerId = currentRecord.getValue(
                         {
                             fieldId: 'entity'
                         }
                     )
                     window.sessionStorage.setItem("entityFieldChange", customerId);
                     console.log(window.sessionStorage.getItem("entityFieldChange"))
                 }

                 if (fieldId == 'trandate') {


                     var trandate = currentRecord.getValue(
                         {
                             fieldId: 'trandate'
                         }
                     )

                     window.sessionStorage.setItem("trandateFieldChange", trandate);
                     console.log("trandate", window.sessionStorage.getItem("trandateFieldChange"))
                 }


                 if (currentRecordType == 'transferorder') {

                     if (fieldId == 'transferlocation') {

                         var locationID = currentRecord.getValue(
                             {
                                 fieldId: 'transferlocation'
                             }
                         )
                         window.sessionStorage.setItem("locationFieldChange", locationID);
                         console.log("locationFieldChange", window.sessionStorage.getItem("locationFieldChange"))

                         var customerId = search.lookupFields({
                             type: search.Type.LOCATION,
                             id: locationID,
                             columns: ['custrecord_ak_location_customer']
                         });

                         if (customerId.custrecord_ak_location_customer.length > 0) {
                             window.sessionStorage.setItem("entityFieldChange", customerId.custrecord_ak_location_customer[0].value);
                             console.log("entityFieldChange", window.sessionStorage.getItem("entityFieldChange"))

                         }

                     }


                 }
                 if (currentRecord.type == 'cashsale' || currentRecord.type == "invoice" || currentRecord.type == "workorder") {

                     if (fieldId == 'location') {

                         var locationID = currentRecord.getValue(
                             {
                                 fieldId: 'location'
                             }
                         )
                         window.sessionStorage.setItem("locationFieldChange", locationID);
                         console.log("locationFieldChange", window.sessionStorage.getItem("locationFieldChange"))


                     }


                 }

                 if (currentRecord.type == 'salesorder' || currentRecord.type == 'cashsale') {

                     if (fieldId == 'location') {

                         var locationID = currentRecord.getValue(
                             {
                                 fieldId: 'location'
                             }
                         )
                         window.sessionStorage.setItem("locationFieldChange", locationID);
                         //console.log("locationFieldChange", window.sessionStorage.getItem("locationFieldChange"))

                         var location = currentRecord.getText(
                             {
                                 fieldId: 'location'
                             }
                         )

                         currentRecordCustomerID = currentRecord.getValue({
                             fieldId: 'entity'
                         });
                         console.log("currentRecordCustomerID", currentRecordCustomerID)

                         if (locationID !== "") {


                             var locationRecord = search.lookupFields({
                                 type: search.Type.LOCATION,
                                 id: locationID,
                                 columns: ['custrecord_location_category_field', 'custrecord_ak_location_demand_season', 'custrecord_ak_location_customer']
                             });

                             var customerInLocationArrayLength = locationRecord.custrecord_ak_location_customer.length
                             if (customerInLocationArrayLength > 0) {
                                 var customerInLocation = locationRecord.custrecord_ak_location_customer[0].text
                             }
                             //var customerInLocation = customerInLocationArrayLength > 0 ?? locationRecord.custrecord_ak_location_customer[0].text;" "
                             locationCategory = locationRecord.custrecord_location_category_field[0].text
                             isDemandSeason = locationRecord.custrecord_ak_location_demand_season


                             var locationSearchObj = search.create({
                                 type: "location",
                                 filters:
                                     [
                                         ["custrecord_ak_location_customer", "anyof", currentRecordCustomerID]
                                     ],
                                 columns:
                                     [
                                         search.createColumn({ name: "internalid", label: "Internal ID" }),
                                         search.createColumn({
                                             name: "name",
                                             label: "Name"
                                         }),
                                         search.createColumn({ name: "custrecord_ak_location_demand_season", label: "Demand Season" }),
                                         search.createColumn({ name: "custrecord_ak_location_customer", label: "Customer" }),
                                         search.createColumn({ name: "custrecord_location_category_field", label: "Location Category" })
                                     ]
                             });
                             var searchResultCount = locationSearchObj.runPaged().count;
                             log.debug("locationSearchObj result count", searchResultCount);

                             var categoryOfLocation, isDemandSeason, customerInLocationRec, locationName, locationInternalID
                             locationSearchObj.run().each(function (result) {
                                 categoryOfLocation = result.getValue({
                                     name: 'custrecord_location_category_field',
                                 });
                                 isDemandSeason = result.getValue({
                                     name: 'custrecord_ak_location_demand_season',
                                 });
                                 customerInLocationRec = result.getValue({
                                     name: 'custrecord_ak_location_customer',
                                 });
                                 locationInternalID = result.getValue({
                                     name: 'internalid',
                                 });
                                 locationName = result.getValue({
                                     name: 'name',
                                 });
                                 return true;
                             });

                             //  console.log("categoryOfLocation", categoryOfLocation)
                             //  console.log("isDemandSeason", isDemandSeason)
                             //  console.log("customerInLocationRec", customerInLocationRec)

                             console.log("isDemandSeason", isDemandSeason)
                             console.log("locationInternalID", locationInternalID)

                             console.log("locationID", locationID)
                             console.log("locationCategory", locationCategory)


                             if (searchResultCount != 0) {
                                 if (isDemandSeason == true && locationInternalID != locationID) {
                                     alert(`You cannot select this location in demand season. Please select ${locationName} instead`)
                                     currentRecord.setValue({ "fieldId": "location", "value": "" })
                                     return false;
                                 }
                                 if (isDemandSeason == false && locationInternalID == locationID) {
                                     alert(`Demand Season is off. Please select any other location.`)
                                     currentRecord.setValue({ "fieldId": "location", "value": "" })
                                 } else if (isDemandSeason == false && locationInternalID != locationID) {
                                     if (locationCategory == 'Buyer') {
                                         alert(`Please select location other than Buyer category`)
                                         currentRecord.setValue({ "fieldId": "location", "value": "" })

                                     }
                                 }
                             }


                             //  if ((isDemandSeason == false && (customerInLocation == currentRecordCustomerID))) {
                             //     alert("1")
                             //     if(categoryOfLocation == 6){
                             //     alert("2")

                             //         alert(`Please select location other than Buyer category`)
                             //         currentRecord.setValue({ "fieldId": "location", "value": "" })
                             //     }
                             //  }

                             // if ((isDemandSeason == true && !(customerInLocation == currentRecordCustomerID))) {}

                             //  if ((isDemandSeason == false && !(customerInLocation == currentRecordCustomerID))) {}



                             //  if ((isDemandSeason == true && !(customerInLocation == currentRecordCustomerID))) {
                             //      alert(`You cannot select this location in demand season. Please select ${locationName} instead`)
                             //      currentRecord.setValue({ "fieldId": "location", "value": "" })
                             //  }
                             //  if ((isDemandSeason == false && (customerInLocation == currentRecordCustomerID))) {
                             //      alert(`You cannot select this location in demand season. Please select ${locationName} instead`)
                             //      currentRecord.setValue({ "fieldId": "location", "value": "" })
                             //  }
                             //  if ((isDemandSeason == false && (customerInLocation == currentRecordCustomerID && locationCategory == 6))) {
                             //      alert(`You cannot ${locationName} location, select location with different location category`)
                             //      currentRecord.setValue({ "fieldId": "location", "value": "" })
                             //  }

                         }

                     }


                 }

                 if (currentRecord.type == "itemfulfillment") {
                     if (sublistName === 'item') {
                         if (sublistFieldName === 'location') {
                             var location = currentRecord.getCurrentSublistValue({
                                 sublistId: sublistName,
                                 fieldId: sublistFieldName
                             })
                             // alert(location)
                             window.sessionStorage.setItem("locationFieldChange", location);
                             console.log("locationFieldChange", window.sessionStorage.getItem("locationFieldChange"))
                         }
                     }
                 }

             }
             return true;
         }
         catch (e) {

             console.log('Error occured: ' + e.message);
             log.debug('Error occured: ' + e.message);

         }
     }

     function nearExpiryMonth(currentRecord, currentRecordType, transactionRecType) {
         try {

             console.log("-------nearExpiryMonth()--------")

             if (currentRecordType == 'inventorydetail') {

                 arrayForInvAssg = []
                 var itemDetailsFromInvAssignment = []
                 var itemDetailsFromInvAssignmentObject = {}


                 var transactionRecLocation = window.sessionStorage.getItem("locationFieldChange")

                 if (transactionRecLocation == null) {
                     transactionRecLocation = window.sessionStorage.getItem("locationPageinit");
                 }

                 var customerId = window.sessionStorage.getItem("entityFieldChange")

                 if (customerId == null) {
                     customerId = window.sessionStorage.getItem("entityPageinit");
                 }

                 var date = window.sessionStorage.getItem("trandateFieldChange")
                 //  console.log("date", date)
                 if (date == null) {
                     date = window.sessionStorage.getItem("trandatePageinit");
                     //  console.log("date", date)
                 }


                 if (transactionRecType == "salesorder" || transactionRecType == "cashsale" || transactionRecType == "invoice" || transactionRecType == "transferorder") {

                     if (customerId != "") {

                         if (transactionRecLocation != "") {

                             if (date != "") {

                                 var nearExpiryMonths = search.lookupFields({
                                     type: search.Type.CUSTOMER,
                                     id: customerId,
                                     columns: ['custentity_ps_near_expiry_months']
                                 });

                                 var trandate = moment(date).format('DD-MMM-YYYY')
                                 var getDate = moment(trandate, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');

                                 var dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")

                                 console.log("expiry", dateAfterNearExpiryDate)

                                 var invItemExpiryDateFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'expirationdate'
                                 });

                                 var invItemNumberFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'inventorydetail'
                                 });
                                 if (invItemNumberFromInvAssignment != '') {

                                     var dateFromInvAssg = moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY')
                                     // arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))

                                     itemDetailsFromInvAssignment.push({
                                         LotNumber: invItemNumberFromInvAssignment,
                                         ExpiryDate: invItemExpiryDateFromInvAssignment
                                     })
                                 }

                                 itemDetailsFromInvAssignmentObject = itemDetailsFromInvAssignment

                                 var result = moment(dateFromInvAssg).isBefore(dateAfterNearExpiryDate)
                                 console.log("compare", dateFromInvAssg + " and " + dateAfterNearExpiryDate)
                                 console.log("result", result)

                                 if (result == true) {
                                     isTrue = true;
                                     //  console.log("isTrue", isTrue)

                                 } else {
                                     isTrue = false;
                                 }

                                 if (isTrue == true) {
                                     alert("Please select the batch with the minimum expiration date of " + dateAfterNearExpiryDate)
                                     console.log("isTrue-if", isTrue)
                                     return false;

                                 } else {
                                     console.log("isTrue-else", isTrue)
                                     return true;

                                 }

                             }
                             else {
                                 alert("Please Select Date.")
                                 // return false;
                             }
                         }
                         else {
                             alert("Please Select Location.")
                             // return false;
                         }

                     }
                     else {
                         //  alert("Please Select Customer.")
                         return true;
                     }



                 }

                 else if (transactionRecType == "itemfulfillment") {

                     var createdFrom = window.sessionStorage.getItem("createdfromPageinit");

                     //-------Near Expiry For Item Fulfillment Created From Transfer Order-------

                     if (createdFrom.includes("Transfer")) {

                         var createdFromID = window.sessionStorage.getItem("createdfromIDPageinit");

                         console.log("createdFromID", createdFromID)

                         var transferOrderLocation = search.lookupFields({
                             type: search.Type.TRANSFER_ORDER,
                             id: createdFromID,
                             columns: ['transferlocation']
                         });

                         var transferOrderLocationLength = transferOrderLocation.transferlocation.length
                         if (transferOrderLocationLength > 0) {
                             var transferOrderLocationID = transferOrderLocation.transferlocation[0].value
                         }
                         //console.log("transferOrderLocationID", transferOrderLocationID)

                         var customerFromLocation = search.lookupFields({
                             type: search.Type.LOCATION,
                             id: transferOrderLocationID,
                             columns: ['custrecord_ak_location_customer']
                         });

                         var customerFromLocationLength = customerFromLocation.custrecord_ak_location_customer.length
                         if (customerFromLocationLength > 0) {
                             var customerId = customerFromLocation.custrecord_ak_location_customer[0].value
                         }
                         console.log("customerFromLocation", customerId)


                         if (customerId != "") {

                             if (date != "") {

                                 var nearExpiryMonths = search.lookupFields({
                                     type: search.Type.CUSTOMER,
                                     id: customerId,
                                     columns: ['custentity_ps_near_expiry_months']
                                 });

                                 var trandate = moment(date).format('DD-MMM-YYYY')
                                 var getDate = moment(trandate, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');

                                 var dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")

                                 console.log("expiry", dateAfterNearExpiryDate)

                                 var invItemExpiryDateFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'expirationdate'
                                 });

                                 var invItemNumberFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'inventorydetail'
                                 });

                                 if (invItemNumberFromInvAssignment != '') {

                                     var dateFromInvAssg = moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY')
                                     // arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))

                                     itemDetailsFromInvAssignment.push({
                                         LotNumber: invItemNumberFromInvAssignment,
                                         ExpiryDate: invItemExpiryDateFromInvAssignment
                                     })
                                 }

                                 itemDetailsFromInvAssignmentObject = itemDetailsFromInvAssignment

                                 var result = moment(dateFromInvAssg).isBefore(dateAfterNearExpiryDate)
                                 console.log("compare", dateFromInvAssg + " and " + dateAfterNearExpiryDate)
                                 console.log("result", result)

                                 if (result == true) {
                                     isTrue = true;
                                     //  console.log("isTrue", isTrue)

                                 } else {
                                     isTrue = false;
                                 }

                                 if (isTrue == true) {
                                     alert("Please select the batch with the minimum expiration date of " + dateAfterNearExpiryDate)

                                     console.log("isTrue-if", isTrue)
                                     return false;

                                 } else {
                                     console.log("isTrue-else", isTrue)
                                 }

                             }
                             //else {
                             //  alert("Please Select Date.")
                             //return false;
                             //}
                             return true;
                         }
                         return true;
                     }


                     //-------Near Expiry For Item Fulfillment Created From Sales Order-------

                     else if (createdFrom.includes("Sales")) {
                         if (customerId != "") {

                             if (date != "") {

                                 var nearExpiryMonths = search.lookupFields({
                                     type: search.Type.CUSTOMER,
                                     id: customerId,
                                     columns: ['custentity_ps_near_expiry_months']
                                 });

                                 var trandate = moment(date).format('DD-MMM-YYYY')
                                 var getDate = moment(trandate, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');

                                 var dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")

                                 console.log("expiry", dateAfterNearExpiryDate)

                                 var invItemExpiryDateFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'expirationdate'
                                 });

                                 var invItemNumberFromInvAssignment = currentRecord.getCurrentSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'inventorydetail'
                                 });

                                 if (invItemNumberFromInvAssignment != '') {

                                     var dateFromInvAssg = moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY')
                                     // arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))

                                     itemDetailsFromInvAssignment.push({
                                         LotNumber: invItemNumberFromInvAssignment,
                                         ExpiryDate: invItemExpiryDateFromInvAssignment
                                     })
                                 }

                                 itemDetailsFromInvAssignmentObject = itemDetailsFromInvAssignment

                                 var result = moment(dateFromInvAssg).isBefore(dateAfterNearExpiryDate)
                                 console.log("compare", dateFromInvAssg + " and " + dateAfterNearExpiryDate)
                                 console.log("result", result)

                                 if (result == true) {
                                     isTrue = true;
                                     //  console.log("isTrue", isTrue)

                                 } else {
                                     isTrue = false;
                                 }

                                 if (isTrue == true) {
                                     alert("Please select the batch with the minimum expiration date of " + dateAfterNearExpiryDate)

                                     console.log("isTrue-if", isTrue)
                                     return false;

                                 } else {
                                     console.log("isTrue-else", isTrue)
                                 }

                             }
                             //else {
                             //  alert("Please Select Date.")
                             //return false;
                             //}
                             return true;
                         }
                     }

                     else {
                         return true;
                     }

                 }


             }

         } catch (e) {
             console.log('Error occured: ' + e.message);

         }

     }

     function fefo(currentRecordContext, currentRecord, currentRecordType, transactionRecType) {

         try {

             console.log("-------fefo()--------")

             if (currentRecordType == "salesorder" || currentRecordType == "cashsale" || currentRecordType == "invoice") {

                 var itemId = currentRecord.getCurrentSublistValue({
                     sublistId: 'item',
                     fieldId: 'item'
                 })

                 console.log("itemid", itemId)

                 var transactionDate = currentRecord.getValue({
                     fieldId: "trandate"
                 })


                 var locationID = currentRecord.getValue({
                     fieldId: 'location'
                 });

                 console.log("locationID", locationID)

                 customerId = currentRecord.getValue(
                     {
                         fieldId: 'entity'
                     }
                 );
                 var nearExpiryMonths;

                 if (customerId != "") {
                     nearExpiryMonths = search.lookupFields({
                         type: search.Type.CUSTOMER,
                         id: customerId,
                         columns: ['custentity_ps_near_expiry_months']
                     });

                     console.log("nearExpiryMonths", nearExpiryMonths)
                     var date = moment(transactionDate).format('DD-MMM-YYYY')
                     var getDate = moment(date, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');
                     console.log("getDate", getDate)

                     var dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")

                     console.log("dateAfterNearExpiryDate", dateAfterNearExpiryDate)

                 }

                 var arrayForItemRec = []

                 var arrayForInvAssg = []

                 console.log("-------------location----------------", locationID)

                 if (locationID > 0) {
                     var inventoryitemSearchObj = search.create({
                         type: "item",
                         filters:
                             [
                                 ["internalid", "anyof", itemId],
                                 "AND",
                                 ["inventorynumber.location", "anyof", locationID],
                                 "AND",
                                 ["inventorynumber.expirationdate", "isnotempty", ""]
                             ],

                         columns:
                             [
                                 search.createColumn({
                                     name: "expirationdate",
                                     join: "inventoryNumber",
                                     label: "Expiration Date"
                                 }),

                                 search.createColumn({
                                     name: "internalid",
                                     join: "inventoryNumber",
                                     label: "Internal ID"
                                 }),
                                 search.createColumn({
                                     name: "location",
                                     join: "inventoryNumber",
                                     label: "Location"
                                 })

                             ]
                     });

                     inventoryitemSearchObj.run().each(function (result) {

                         var invItemNumber = result.getValue({
                             name: "internalid",
                             join: "inventoryNumber",
                             label: "Internal ID"
                         })

                         var invItemExpiryDate = result.getValue({
                             name: "expirationdate",
                             join: "inventoryNumber",
                             label: "Expiration Date"
                         })


                         arrayForItemRec.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))



                         return true;
                     });


                     //Sorting 

                     arrayForItemRec.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });

                     console.log("arrayForItemRec", arrayForItemRec)
                 }
                 var hasSublistSubrecord = currentRecord.hasCurrentSublistSubrecord({
                     sublistId: "item",
                     fieldId: "inventorydetail"
                 })
                 if (hasSublistSubrecord == true) {
                     var subrec = currentRecord.getCurrentSublistSubrecord({
                         sublistId: 'item',
                         fieldId: 'inventorydetail'
                     });

                     var invDetailSubrecLineCount = subrec.getLineCount({ "sublistId": "inventoryassignment" });

                     for (var j = 0; j < invDetailSubrecLineCount; j++) {

                         var invItemExpiryDateFromInvAssignment = subrec.getSublistValue({
                             sublistId: 'inventoryassignment',
                             fieldId: 'expirationdate',
                             line: j
                         });

                         var invItemNumberFromInvAssignment = subrec.getSublistValue({
                             sublistId: 'inventoryassignment',
                             fieldId: 'inventorydetail',
                             line: j
                         });



                         if (invItemNumberFromInvAssignment != '') {

                             arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))


                         }

                     }

                     //Sorting 
                     arrayForInvAssg.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });



                 }

                 var expiredItemFilter = arrayForItemRec.filter((date) => !moment(date).isBefore(transactionDate));


                 var filteredArrayFromInvRec = expiredItemFilter.filter((date) => !moment(date).isBefore(dateAfterNearExpiryDate));
                 console.log("filteredArrayFromInvRec", filteredArrayFromInvRec)
                 var filteredDates = filteredArrayFromInvRec.filter((date) => !arrayForInvAssg.includes(date));

                 // console.log("dateAfterNearExpiryDate", dateAfterNearExpiryDate)

                 // var expiredItemFilter = arrayForItemRec.filter((date) => !moment(date).isBefore(transactionDate));
                 // var filteredArrayFromInvRec = expiredItemFilter.filter((date) => !moment(date).isBefore(arrayForItemRec));

                 // console.log("filteredDates", filteredDates)

                 //var filteredArrayFromInvRec = expiredItemFilter.filter((date) => !moment(date).isBefore(nearExpiryMonths));

                 filteredDates.sort(function (a, b) {
                     return moment(a).format('X') - moment(b).format('X')
                 });

                 console.log("array1: ", filteredDates)
                 console.log("array2: ", arrayForInvAssg)




                 var isFEFO = false;
                 for (var i = 0; i < filteredDates.length; i++) {
                     for (var j = 0; j < arrayForInvAssg.length; j++) {
                         var result = moment(filteredDates[i]).isBefore(arrayForInvAssg[j])

                         if (filteredDates != '' && result == true) {

                             isFEFO = true;
                             console.log("isFefo", isFEFO)
                             break;
                         }
                     }
                 }

                 if (isFEFO == true) {
                     alert("The nearest expiry batch has not been selected.")

                     var notFEFO = currentRecord.setCurrentSublistValue({
                         sublistId: 'item',
                         fieldId: 'custcol_ak_not_fefo',
                         value: true
                     })
                 } else {

                     var notFEFO = currentRecord.setCurrentSublistValue({
                         sublistId: 'item',
                         fieldId: 'custcol_ak_not_fefo',
                         value: false
                     })
                 }




             }

             // ----------------  Troubleshooting ( ITEM FULFILLMENT PART ) --------------

             if (currentRecordType == "inventorydetail" && transactionRecType == "itemfulfillment") {

                 console.log("alert function for FEFO")

                 var createdFrom = window.sessionStorage.getItem("createdfromPageinit");

                 if (createdFrom.includes("Sales")) {

                     var itemId = currentRecord.getValue({
                         fieldId: 'item'
                     })

                     var locationID = window.sessionStorage.getItem("locationFieldChange")

                     if (locationID == null) {
                         locationID = window.sessionStorage.getItem("locationPageinit");
                     }

                     var customerId = window.sessionStorage.getItem("entityFieldChange")

                     if (customerId == null) {
                         customerId = window.sessionStorage.getItem("entityPageinit");
                     }

                     var currentDate = window.sessionStorage.getItem("trandateFieldChange")

                     if (currentDate == null) {
                         currentDate = window.sessionStorage.getItem("trandatePageinit");

                     }

                     // console.log("locationID", locationID)
                     var nearExpiryMonths, date, getDate, dateAfterNearExpiryDate;
                     if (customerId != "") {

                         nearExpiryMonths = search.lookupFields({
                             type: search.Type.CUSTOMER,
                             id: customerId,
                             columns: ['custentity_ps_near_expiry_months']
                         });

                         //console.log("nearExpiryMonths", nearExpiryMonths )

                         date = moment(currentDate).format('DD-MMM-YYYY')
                         getDate = moment(date, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');
                         // console.log("getDate", getDate)

                         dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")
                     }
                     //  console.log("dateAfterNearExpiryDate", dateAfterNearExpiryDate)

                     var arrayForItemRec = []

                     var arrayForInvAssg = []

                     if (locationID != "" && itemId != "") {
                         var inventoryitemSearchObj = search.create({
                             type: "item",
                             filters:
                                 [

                                     ["internalid", "anyof", itemId],
                                     "AND",
                                     ["inventorynumber.location", "anyof", locationID],
                                     "AND",
                                     ["inventorynumber.expirationdate", "isnotempty", ""]
                                 ],

                             columns:
                                 [
                                     search.createColumn({
                                         name: "expirationdate",
                                         join: "inventoryNumber",
                                         label: "Expiration Date"
                                     }),

                                     search.createColumn({
                                         name: "internalid",
                                         join: "inventoryNumber",
                                         label: "Internal ID"
                                     }),
                                     search.createColumn({
                                         name: "location",
                                         join: "inventoryNumber",
                                         label: "Location"
                                     })

                                 ]
                         });

                         inventoryitemSearchObj.run().each(function (result) {

                             var invItemNumber = result.getValue({
                                 name: "internalid",
                                 join: "inventoryNumber",
                                 label: "Internal ID"
                             })

                             var invItemExpiryDate = result.getValue({
                                 name: "expirationdate",
                                 join: "inventoryNumber",
                                 label: "Expiration Date"
                             })


                             arrayForItemRec.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))


                             return true;
                         });
                     }


                     // //Sorting 

                     arrayForItemRec.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });


                     var invDetailSubrecLineCount = currentRecordContext.getLineCount({ "sublistId": "inventoryassignment" });

                     for (var iterator = 0; iterator < invDetailSubrecLineCount; iterator++) {

                         var invItemExpiryDateFromInvAssignment = currentRecordContext.getSublistValue({
                             sublistId: 'inventoryassignment',
                             fieldId: 'expirationdate',
                             line: iterator
                         });

                         var invItemNumberFromInvAssignment = currentRecordContext.getSublistValue({
                             sublistId: 'inventoryassignment',
                             fieldId: 'inventorydetail',
                             line: iterator
                         });



                         if (invItemNumberFromInvAssignment != '') {

                             arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))

                         }
                     }
                     //  console.log("arrayForInvAssg", arrayForInvAssg)
                     // //Sorting 
                     arrayForInvAssg.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });


                     var expiredItemFilter = arrayForItemRec.filter((date) => !moment(date).isBefore(currentDate));


                     var nearExpiryMonthsFilter = expiredItemFilter.filter((date) => !moment(date).isBefore(dateAfterNearExpiryDate));

                     var filteredDates = nearExpiryMonthsFilter.filter((date) => !arrayForInvAssg.includes(date));

                     filteredDates.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });



                     console.log("filteredDates", filteredDates)
                     var isFEFO = false;
                     for (var i = 0; i < filteredDates.length; i++) {
                         console.log("for loop", i)
                         for (var j = 0; j < arrayForInvAssg.length; j++) {

                             var result = moment(filteredDates[i]).isBefore(arrayForInvAssg[j])

                             if (filteredDates != '' && result == true) {

                                 isFEFO = true;
                                 console.log("isFefo", isFEFO)
                                 break;
                             }
                         }



                         if (isFEFO == true) {
                             alert("The nearest expiry batch has not been selected.")

                             var notFEFO = currentRecord.setCurrentSublistValue({
                                 sublistId: 'item',
                                 fieldId: 'custcol_ak_not_fefo',
                                 value: true
                             })
                             break;
                         } else {

                             var notFEFO = currentRecord.setCurrentSublistValue({
                                 sublistId: 'item',
                                 fieldId: 'custcol_ak_not_fefo',
                                 value: false
                             })

                             break;
                         }



                     }
                 }


                 return true;

             }

             if (currentRecordType == 'itemfulfillment') {

                 var createdFrom = window.sessionStorage.getItem("createdfromPageinit");

                 if (createdFrom.includes("Sales")) {


                     var locationID = window.sessionStorage.getItem("locationFieldChange")

                     if (locationID == null) {
                         locationID = window.sessionStorage.getItem("locationPageinit");
                     }

                     var customerId = window.sessionStorage.getItem("entityFieldChange")

                     if (customerId == null) {
                         customerId = window.sessionStorage.getItem("entityPageinit");
                     }

                     var transactionDate = window.sessionStorage.getItem("trandateFieldChange")

                     if (transactionDate == null) {
                         transactionDate = window.sessionStorage.getItem("trandatePageinit");
                         // console.log("date", transactionDate)
                     }

                     var itemLineCount = currentRecord.getLineCount({ "sublistId": "item" });
                     var nearExpiryMonths, date, getDate, dateAfterNearExpiryDate;
                     if (customerId != "") {
                         nearExpiryMonths = search.lookupFields({
                             type: search.Type.CUSTOMER,
                             id: customerId,
                             columns: ['custentity_ps_near_expiry_months']
                         });

                         // console.log("nearExpiryMonths", nearExpiryMonths)
                         date = moment(transactionDate).format('DD-MMM-YYYY')
                         getDate = moment(date, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');
                         // console.log("getDate", getDate)

                         dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")

                         // console.log("dateAfterNearExpiryDate", dateAfterNearExpiryDate)


                     }

                     var arrayForItemRec = []
                     var arrayForInvAssg = []

                     var itemLineCount = currentRecord.getLineCount({ "sublistId": "item" });

                     for (var i = 0; i < itemLineCount; i++) {

                         var itemId = currentRecord.getSublistValue({
                             sublistId: 'item',
                             fieldId: 'item',
                             line: i
                         })

                         // console.log("itemId", itemId)

                         var locationID = currentRecord.getSublistValue({
                             sublistId: 'item',
                             fieldId: 'location',
                             line: i
                         })

                         // console.log("locationID", locationID)

                         if (locationID != "" && itemId != "") {

                             var inventoryitemSearchObj = search.create({
                                 type: "item",
                                 filters:
                                     [

                                         ["internalid", "anyof", itemId],
                                         "AND",
                                         ["inventorynumber.location", "anyof", locationID],
                                         "AND",
                                         ["inventorynumber.expirationdate", "isnotempty", ""]
                                     ],

                                 columns:
                                     [
                                         search.createColumn({
                                             name: "expirationdate",
                                             join: "inventoryNumber",
                                             label: "Expiration Date"
                                         }),

                                         search.createColumn({
                                             name: "internalid",
                                             join: "inventoryNumber",
                                             label: "Internal ID"
                                         }),
                                         search.createColumn({
                                             name: "location",
                                             join: "inventoryNumber",
                                             label: "Location"
                                         })


                                     ]
                             });


                             inventoryitemSearchObj.run().each(function (result) {

                                 var invItemNumber = result.getValue({
                                     name: "internalid",
                                     join: "inventoryNumber",
                                     label: "Internal ID"
                                 })

                                 var invItemExpiryDate = result.getValue({
                                     name: "expirationdate",
                                     join: "inventoryNumber",
                                     label: "Expiration Date"
                                 })


                                 arrayForItemRec.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))

                                 return true;
                             });

                             console.log("Raw array ----- ", arrayForItemRec)
                             arrayForItemRec.sort(function (a, b) {
                                 return moment(a).format('X') - moment(b).format('X')
                             });

                         }

                         console.log("After sorting ---- ", arrayForItemRec)
                         arrayForItemRec = [...new Set(arrayForItemRec)]

                         console.log("After unique --- ", arrayForItemRec)

                         var expiredItemFilter = arrayForItemRec.filter((date) => !moment(date).isBefore(transactionDate));


                         var filteredArrayFromInvRec = expiredItemFilter.filter((date) => !moment(date).isBefore(dateAfterNearExpiryDate));
                         console.log("After filteration ------ ", filteredArrayFromInvRec)

                         //now load the subrecord inventory details of each line
                         currentRecord.selectLine({
                             sublistId: "item",
                             line: i
                         })

                         var subrec = currentRecord.getCurrentSublistSubrecord({
                             sublistId: 'item',
                             fieldId: 'inventorydetail'

                         });

                         var invDetailSubrecLineCount = subrec.getLineCount({ "sublistId": "inventoryassignment" });
                         var inventoryAssignmentItemsExpirationDate = []
                         for (var j = 0; j < invDetailSubrecLineCount; j++) {

                             var invItemExpiryDate = subrec.getSublistValue({
                                 sublistId: 'inventoryassignment',
                                 fieldId: 'expirationdate',
                                 line: j
                             });

                             var invItemNumberFromInvAssignment = subrec.getSublistValue({
                                 sublistId: 'inventoryassignment',
                                 fieldId: 'issueinventorynumber',
                                 line: j
                             });

                             inventoryAssignmentItemsExpirationDate.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))


                         }

                         var filteredDates = filteredArrayFromInvRec.filter((date) => !inventoryAssignmentItemsExpirationDate.includes(date));

                         filteredDates.sort(function (a, b) {
                             return moment(a).format('X') - moment(b).format('X')
                         });

                         var isFEFO = false;
                         console.log("inventoryAssignmentItemsExpirationDate", inventoryAssignmentItemsExpirationDate)
                         for (var k = 0; k < filteredDates.length; k++) {

                             for (let l = 0; l < inventoryAssignmentItemsExpirationDate.length; l++) {
                                 var result = moment(filteredDates[k]).isBefore(inventoryAssignmentItemsExpirationDate[l])
                                 console.log(` ${filteredDates[k]} isBefore ${inventoryAssignmentItemsExpirationDate[l]}`, moment(filteredDates[k]).isBefore(inventoryAssignmentItemsExpirationDate[l]))
                                 if (filteredDates != '' && result == true) {

                                     isFEFO = true;
                                     console.log("isFefo inside if", isFEFO)
                                     break;
                                 }
                                 // else {
                                 //     isFEFO = false;
                                 //     console.log("isFefo inside else ", isFEFO)
                                 //     //break;
                                 // }
                                
                             }
                         }

                         
                         if (isFEFO == true) {

                             currentRecordContext.selectLine({
                                 sublistId: "item",
                                 line: i
                             })

                             currentRecordContext.setCurrentSublistValue({
                                 sublistId: "item",
                                 fieldId: "custcol_ak_not_fefo",
                                 value: true

                             })
                             console.log("isFefo true before return false", isFEFO)
                             return false;

                         } else if (isFEFO == false) {

                             currentRecordContext.selectLine({
                                 sublistId: "item",
                                 line: i
                             })

                             currentRecordContext.setCurrentSublistValue({
                                 sublistId: "item",
                                 fieldId: "custcol_ak_not_fefo",
                                 value: false

                             })

                             console.log("isFefo false before return false", isFEFO)

                             return false;



                         }
                     }

                 }


                 else {
                     return true;
                 }



             }


             // ----------------  Dont Touch Even ( WORK ORDER PART ) --------------

             if (currentRecordType == "inventorydetail" && transactionRecType == "workorder") {

                 console.log("alert function for FEFO")

                 var itemId = currentRecord.getValue({
                     fieldId: 'item'
                 })

                 var locationID = window.sessionStorage.getItem("locationFieldChange")

                 if (locationID == null) {
                     locationID = window.sessionStorage.getItem("locationPageinit");
                 }

                 var customerId = window.sessionStorage.getItem("entityFieldChange")

                 if (customerId == null) {
                     customerId = window.sessionStorage.getItem("entityPageinit");
                 }

                 var currentDate = window.sessionStorage.getItem("trandateFieldChange")

                 if (currentDate == null) {
                     currentDate = window.sessionStorage.getItem("trandatePageinit");

                 }

                 // console.log("locationID", locationID)
                 var nearExpiryMonths, date, getDate, dateAfterNearExpiryDate;
                 if (customerId != "") {

                     nearExpiryMonths = search.lookupFields({
                         type: search.Type.CUSTOMER,
                         id: customerId,
                         columns: ['custentity_ps_near_expiry_months']
                     });

                     //console.log("nearExpiryMonths", nearExpiryMonths )

                     date = moment(currentDate).format('DD-MMM-YYYY')
                     getDate = moment(date, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');
                     // console.log("getDate", getDate)

                     dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")
                 }
                 //  console.log("dateAfterNearExpiryDate", dateAfterNearExpiryDate)

                 var arrayForItemRec = []

                 var arrayForInvAssg = []

                 if (locationID != "" && itemId != "") {
                     var inventoryitemSearchObj = search.create({
                         type: "item",
                         filters:
                             [

                                 ["internalid", "anyof", itemId],
                                 "AND",
                                 ["inventorynumber.location", "anyof", locationID],
                                 "AND",
                                 ["inventorynumber.expirationdate", "isnotempty", ""]
                             ],

                         columns:
                             [
                                 search.createColumn({
                                     name: "expirationdate",
                                     join: "inventoryNumber",
                                     label: "Expiration Date"
                                 }),

                                 search.createColumn({
                                     name: "internalid",
                                     join: "inventoryNumber",
                                     label: "Internal ID"
                                 }),
                                 search.createColumn({
                                     name: "location",
                                     join: "inventoryNumber",
                                     label: "Location"
                                 })

                             ]
                     });

                     inventoryitemSearchObj.run().each(function (result) {

                         var invItemNumber = result.getValue({
                             name: "internalid",
                             join: "inventoryNumber",
                             label: "Internal ID"
                         })

                         var invItemExpiryDate = result.getValue({
                             name: "expirationdate",
                             join: "inventoryNumber",
                             label: "Expiration Date"
                         })


                         arrayForItemRec.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))


                         return true;
                     });
                 }


                 // //Sorting 

                 arrayForItemRec.sort(function (a, b) {
                     return moment(a).format('X') - moment(b).format('X')
                 });


                 console.log("arrayForItemRec", arrayForItemRec)
                 var invDetailSubrecLineCount = currentRecordContext.getLineCount({ "sublistId": "inventoryassignment" });

                 for (var iterator = 0; iterator < invDetailSubrecLineCount; iterator++) {

                     var invItemExpiryDateFromInvAssignment = currentRecordContext.getSublistValue({
                         sublistId: 'inventoryassignment',
                         fieldId: 'expirationdate',
                         line: iterator
                     });

                     var invItemNumberFromInvAssignment = currentRecordContext.getSublistValue({
                         sublistId: 'inventoryassignment',
                         fieldId: 'inventorydetail',
                         line: iterator
                     });



                     if (invItemNumberFromInvAssignment != '') {

                         arrayForInvAssg.push(moment(invItemExpiryDateFromInvAssignment).format('DD-MMM-YYYY'))

                     }
                 }
                 //  console.log("arrayForInvAssg", arrayForInvAssg)
                 // //Sorting 
                 arrayForInvAssg.sort(function (a, b) {
                     return moment(a).format('X') - moment(b).format('X')
                 });
                 console.log("arrayForInvAssg", arrayForInvAssg)


                 var expiredItemFilter = arrayForItemRec.filter((date) => !moment(date).isBefore(currentDate));

                 //var nearExpiryMonthsFilter = expiredItemFilter.filter((date) => !moment(date).isBefore(dateAfterNearExpiryDate));

                 var filteredDates = expiredItemFilter.filter((date) => !arrayForInvAssg.includes(date));

                 filteredDates.sort(function (a, b) {
                     return moment(a).format('X') - moment(b).format('X')
                 });
                 console.log("filteredDates", filteredDates)

                 var isFEFO = false;
                 for (var i = 0; i < filteredDates.length; i++) {
                     for (var j = 0; j < arrayForInvAssg.length; j++) {
                         var result = moment(filteredDates[i]).isBefore(arrayForInvAssg[j])

                         if (filteredDates != '' && result == true) {

                             isFEFO = true;
                             console.log("isFefo", isFEFO)
                             break;
                         }
                     }
                 }

                 if (isFEFO == true) {
                     alert("The nearest expiry batch has not been selected.")

                     // var notFEFO = currentRecord.setCurrentSublistValue({
                     //     sublistId: 'item',
                     //     fieldId: 'custcol_ak_not_fefo',
                     //     value: true
                     // })
                 } else {

                     // var notFEFO = currentRecord.setCurrentSublistValue({
                     //     sublistId: 'item',
                     //     fieldId: 'custcol_ak_not_fefo',
                     //     value: false
                     // })
                 }

             }

             if (transactionRecType == "workorder") {

                 var customerId = window.sessionStorage.getItem("entityFieldChange")

                 if (customerId == null) {
                     customerId = window.sessionStorage.getItem("entityPageinit");
                 }

                 var transactionDate = window.sessionStorage.getItem("trandateFieldChange")

                 if (transactionDate == null) {
                     transactionDate = window.sessionStorage.getItem("trandatePageinit");

                 }

                 var itemLineCount = currentRecord.getLineCount({ "sublistId": "item" });

                 if (customerId != "") {
                     var nearExpiryMonths = search.lookupFields({
                         type: search.Type.CUSTOMER,
                         id: customerId,
                         columns: ['custentity_ps_near_expiry_months']
                     });


                     var date = moment(transactionDate).format('DD-MMM-YYYY')
                     var getDate = moment(date, "DD-MMM-YYYY").add(nearExpiryMonths.custentity_ps_near_expiry_months, 'months');

                     var dateAfterNearExpiryDate = getDate.format("DD-MMM-YYYY")
                 }


                 var arrayForItemRec = []
                 var arrayForInvAssg = []

                 var itemLineCount = currentRecord.getLineCount({ "sublistId": "item" });

                 for (var i = 0; i < itemLineCount; i++) {

                     var itemId = currentRecord.getSublistValue({
                         sublistId: 'item',
                         fieldId: 'item',
                         line: i
                     })

                     console.log("----------- Line Number ----------", i)
                     console.log("itemId", itemId)

                     var locationID = currentRecord.getValue({
                         fieldId: 'location',
                         line: i
                     })

                     console.log("locationID", locationID)

                     if (locationID != "" && itemId != "") {
                         var inventoryitemSearchObj = search.create({
                             type: "item",
                             filters:
                                 [

                                     ["internalid", "anyof", itemId],
                                     "AND",
                                     ["inventorynumber.location", "anyof", locationID],
                                     "AND",
                                     ["inventorynumber.expirationdate", "isnotempty", ""]
                                 ],

                             columns:
                                 [
                                     search.createColumn({
                                         name: "expirationdate",
                                         join: "inventoryNumber",
                                         label: "Expiration Date"
                                     }),

                                     search.createColumn({
                                         name: "internalid",
                                         join: "inventoryNumber",
                                         label: "Internal ID"
                                     }),
                                     search.createColumn({
                                         name: "location",
                                         join: "inventoryNumber",
                                         label: "Location"
                                     })


                                 ]
                         });


                         inventoryitemSearchObj.run().each(function (result) {

                             var invItemNumber = result.getValue({
                                 name: "internalid",
                                 join: "inventoryNumber",
                                 label: "Internal ID"
                             })

                             var invItemExpiryDate = result.getValue({
                                 name: "expirationdate",
                                 join: "inventoryNumber",
                                 label: "Expiration Date"
                             })


                             arrayForItemRec.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))

                             return true;
                         });
                     }

                     arrayForItemRec.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });

                     arrayForItemRec = [...new Set(arrayForItemRec)]

                     var filteredArrayFromInvRec = arrayForItemRec.filter((date) => !moment(date).isBefore(transactionDate));

                     currentRecord.selectLine({
                         sublistId: "item",
                         line: i
                     })
                     var hasSublistSubrecord = currentRecord.hasCurrentSublistSubrecord({
                         sublistId: "item",
                         fieldId: "inventorydetail"
                     })

                     var inventoryAssignmentItemsExpirationDate = []
                     if (hasSublistSubrecord == true) {
                         var subrec = currentRecord.getCurrentSublistSubrecord({
                             sublistId: 'item',
                             fieldId: 'inventorydetail'

                         });
                         var invDetailSubrecLineCount = subrec.getLineCount({ "sublistId": "inventoryassignment" });
                         console.log("invDetailSubrecLineCount", invDetailSubrecLineCount)

                         if (invDetailSubrecLineCount > 0) {

                             for (var j = 0; j < invDetailSubrecLineCount; j++) {

                                 var invItemExpiryDate = subrec.getSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'expirationdate',
                                     line: j
                                 });

                                 var invItemNumberFromInvAssignment = subrec.getSublistValue({
                                     sublistId: 'inventoryassignment',
                                     fieldId: 'issueinventorynumber',
                                     line: j
                                 });

                                 inventoryAssignmentItemsExpirationDate.push(moment(invItemExpiryDate).format('DD-MMM-YYYY'))


                             }
                         }

                     }

                     var filteredDates = filteredArrayFromInvRec.filter((date) => !inventoryAssignmentItemsExpirationDate.includes(date));

                     filteredDates.sort(function (a, b) {
                         return moment(a).format('X') - moment(b).format('X')
                     });

                     var isFEFO = false;

                     for (var k = 0; k < filteredDates.length; k++) {
                         for (let l = 0; l < inventoryAssignmentItemsExpirationDate.length; l++) {
                             var result = moment(filteredDates[k]).isBefore(inventoryAssignmentItemsExpirationDate[l])
                             console.log(` ${filteredDates[k]} isBefore ${inventoryAssignmentItemsExpirationDate[l]}`, moment(filteredDates[k]).isBefore(inventoryAssignmentItemsExpirationDate[l]))
                             if (filteredDates != '' && result == true) {

                                 isFEFO = true;

                                 console.log("/////////// isFefo inside if", isFEFO)
                                 break;
                             }
                             else {
                                 isFEFO = false;
                                 console.log(" /////////// isFefo inside else ", isFEFO)
                                 break;
                             }
                         }
                     }

                     if (isFEFO == true) {
                         console.log("---------------------true-------------------")

                         currentRecordContext.selectLine({
                             sublistId: "item",
                             line: i
                         })

                         currentRecordContext.setCurrentSublistValue({
                             sublistId: "item",
                             fieldId: "custcol_ak_not_fefo",
                             value: true

                         })
                     } else if (isFEFO == false) {

                         console.log("---------------------false-------------------")
                         currentRecordContext.selectLine({
                             sublistId: "item",
                             line: i
                         })

                         currentRecordContext.setCurrentSublistValue({
                             sublistId: "item",
                             fieldId: "custcol_ak_not_fefo",
                             value: false

                         })



                     }
                 }




             }
             // ------------------------------------------------


         } catch (e) {
             console.log('Error occured: ' + e.message);

         }
     }

     function validateLine(context) {
         try {

             console.log("------validateline-----")
             var currentRecordContext = context.currentRecord;
             var currentRecord = nsCurrentRec.get();
             var currentRecordType = currentRecord.type;
             var transactionRecType = window.sessionStorage.getItem("currentRecordType")

             if (currentRecordType == "salesorder" || currentRecordType == "cashsale" || currentRecordType == "invoice") {


                 fefo(currentRecordContext, currentRecord, currentRecordType, transactionRecType);
                 return true;
             }

             else if (currentRecordType == 'inventorydetail' && (transactionRecType == "cashsale" || transactionRecType == "salesorder" || transactionRecType == "invoice" || transactionRecType == "itemfulfillment" || transactionRecType == "transferorder")) {


                 return nearExpiryMonth(currentRecord, currentRecordType, transactionRecType)

             }

             else {

                 return true;
             }





         } catch (e) {
             console.log('Error occured: ' + e.message);

         }

     }

     function saveRecord(context) {
         try {

             var currentRecordContext = context.currentRecord;
             var currentRecord = nsCurrentRec.get();
             var currentRecordType = currentRecord.type;
             var transactionRecType = window.sessionStorage.getItem("currentRecordType")

             if (currentRecordType == "inventorydetail" && (transactionRecType == "itemfulfillment" || transactionRecType == "workorder")) {

                 console.log("saveRecord Triggered")

                 fefo(currentRecordContext, currentRecord, currentRecordType, transactionRecType);
                 return true;

             }


             else if (currentRecordType == 'itemfulfillment') {

                 var locationID = window.sessionStorage.getItem("locationFieldChange")

                 if (locationID == null) {
                     locationID = window.sessionStorage.getItem("locationPageinit");
                 }

                 var customerId = window.sessionStorage.getItem("entityFieldChange")

                 if (customerId == null) {
                     customerId = window.sessionStorage.getItem("entityPageinit");
                 }

                 var transactionDate = window.sessionStorage.getItem("trandateFieldChange")

                 if (transactionDate == null) {
                     transactionDate = window.sessionStorage.getItem("trandatePageinit");
                     // console.log("date", transactionDate)
                 }

                 var itemLineCount = currentRecord.getLineCount({ "sublistId": "item" });

                 fefo(currentRecordContext, currentRecord, currentRecordType, transactionRecType);


                 if (currentRecord.type == 'itemfulfillment') {

                     for (var i = 0; i < itemLineCount; i++) {


                         currentRecord.selectLine({
                             sublistId: 'item',
                             line: i
                         });

                         var locationID = currentRecord.getCurrentSublistValue({
                             sublistId: 'item',
                             fieldId: 'location'
                         });

                         var location = currentRecord.getCurrentSublistText({
                             sublistId: 'item',
                             fieldId: 'location'
                         });
                         console.log("location", location)


                         currentRecordCustomerID = currentRecord.getValue({
                             fieldId: 'entity'
                         });
                         console.log("currentRecordCustomerID", currentRecordCustomerID)


                         if (locationID != "" && currentRecordCustomerID != "") {


                             var locationRecord = search.lookupFields({
                                 type: search.Type.LOCATION,
                                 id: locationID,
                                 columns: ['custrecord_location_category_field', 'custrecord_ak_location_demand_season', 'custrecord_ak_location_customer']
                             });

                             var customerInLocationArrayLength = locationRecord.custrecord_ak_location_customer.length
                             if (customerInLocationArrayLength > 0) {
                                 var customerInLocation = locationRecord.custrecord_ak_location_customer[0].text
                             }
                             //var customerInLocation = customerInLocationArrayLength > 0 ?? locationRecord.custrecord_ak_location_customer[0].text;" "
                             locationCategory = locationRecord.custrecord_location_category_field[0].text
                             isDemandSeason = locationRecord.custrecord_ak_location_demand_season

                             var locationSearchObj = search.create({
                                 type: "location",
                                 filters:
                                     [
                                         ["custrecord_ak_location_customer", "anyof", currentRecordCustomerID]
                                     ],
                                 columns:
                                     [
                                         search.createColumn({ name: "internalid", label: "Internal ID" }),
                                         search.createColumn({
                                             name: "name",
                                             label: "Name"
                                         }),
                                         search.createColumn({ name: "custrecord_ak_location_demand_season", label: "Demand Season" }),
                                         search.createColumn({ name: "custrecord_ak_location_customer", label: "Customer" }),
                                         search.createColumn({ name: "custrecord_location_category_field", label: "Location Category" })
                                     ]
                             });
                             var searchResultCount = locationSearchObj.runPaged().count;
                             log.debug("locationSearchObj result count", searchResultCount);

                             var categoryOfLocation, isDemandSeason, customerInLocationRec, locationName, locationInternalID
                             locationSearchObj.run().each(function (result) {
                                 categoryOfLocation = result.getValue({
                                     name: 'custrecord_location_category_field',
                                 });
                                 isDemandSeason = result.getValue({
                                     name: 'custrecord_ak_location_demand_season',
                                 });
                                 customerInLocationRec = result.getValue({
                                     name: 'custrecord_ak_location_customer',
                                 });
                                 locationInternalID = result.getValue({
                                     name: 'internalid',
                                 });
                                 locationName = result.getValue({
                                     name: 'name',
                                 });
                                 return true;
                             });


                             console.log("isDemandSeason", isDemandSeason)
                             console.log("locationInternalID", locationInternalID)

                             console.log("locationID", locationID)
                             console.log("locationCategory", locationCategory)
                             console.log("searchResultCount", searchResultCount)


                             if (searchResultCount != 0) {
                                 var line = i + 1
                                 if (isDemandSeason == true && locationInternalID != locationID) {
                                     alert('You cannot select this location at line ' + line + ' in demand season. Please select ' + locationName + " instead.")
                                     // currentRecord.setSublistValue({ "fieldId": "location", "value": "" })
                                     return false;
                                 }
                                 if (isDemandSeason == false && locationInternalID == locationID) {
                                     alert("Demand Season is off. Please select any other location at line " + line + ".")
                                     //currentRecord.setValue({ "fieldId": "location", "value": "" })
                                     return false;
                                 }

                                 else if (isDemandSeason == false && locationInternalID != locationID) {
                                     if (locationCategory == 'Buyer') {
                                         alert('At line ' + line + ', please select location other than Buyer category')
                                         // currentRecord.setSublistValue({ "sublistid": "item", "fieldId": "location", "value": "" })
                                         return false;
                                     }
                                 }
                             }

                         }




                     }
                 }

                 return true;
             }


             else if (transactionRecType == "workorder") {
                 fefo(currentRecordContext, currentRecord, currentRecordType, transactionRecType);
                 return true;
             }

             else {
                 return true;
             }



         } catch (e) {
             console.log('Error occured: ' + e.message);

         }

     }


     return {
         pageInit: pageInit,
         fieldChanged: fieldChanged,
         validateLine: validateLine,
         saveRecord: saveRecord,

     };


 }

);
