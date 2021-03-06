var vendor='UPS';
var api= 'https://wwwcie.ups.com/rest/Rate';
function service(code){
	var service = {
    '01' : 'UPS Next Day Air',
    '02' : 'UPS 2nd Day Air',
    '03' : 'UPS Ground',
    '07' : 'UPS Worldwide Express',
    '08' : 'UPS Worldwide Expedited',
    '11' : 'UPS Standard',
    '12' : 'UPS 3 Day Select',
    '13' : 'UPS Next Day Air Saver',
    '14' : 'UPS Next Day Air Early A.M.',
    '54' : 'UPS Worldwide Express Plus',
    '59' : 'UPS 2nd Day Air A.M.',
    '65' : 'UPS Saver',
    '82' : 'UPS Today Standard',
    '83' : 'UPS Today Dedicated Courier',
    '84' : 'UPS Today Intercity',
    '85' : 'UPS Today Express',
    '86' : 'UPS Today Express Saver'
	};
	
	if(service[code])
		return service[code];
	else
		return 'Service '+code;
}

function currency(a){
	return '$'+a;
}
function result(main,compare){
	var pack=Array();
	var comp={};	
						for(var i in compare){
							var d=compare[i];
							comp[d.Service.Code]=currency(d.TotalCharges.MonetaryValue);
						}
						
						for(var i in main){
							var d=main[i];
							var deli ={ days: 'Slow', day_raw : 100 };
							if(d.GuaranteedDelivery){
								deli={ days: d.GuaranteedDelivery.BusinessDaysInTransit+' days', day_raw : d.GuaranteedDelivery.BusinessDaysInTransit };
							}
							pack.push({ carrier: vendor, 'service': service(d.Service.Code), cost_num: d.TotalCharges.MonetaryValue, cost: currency(d.TotalCharges.MonetaryValue), delivery: deli, compare: comp[d.Service.Code] });						
						}
	return pack;
}
function prepare(pack,orig,dest){
      var option={},ureq={},pickuptype={},customerclassification={},shipper={},address={},shipto={},addressTo={},shipment={},addressFrom={},shipfrom={};
	  option.RequestOption = 'Shop';
      ureq.Request = option;

      pickuptype['Code'] = '01';
      pickuptype['Description'] = 'Daily Pickup';
      ureq.PickupType = pickuptype;

      customerclassification['Code'] = '01';
      customerclassification['Description'] = 'Classfication';
      ureq.CustomerClassification = customerclassification;

      shipper['Name'] = 'Imani Carr';
      shipper['ShipperNumber'] = '';
      address.AddressLine = Array();
      address.City = 'Timonium';
      address.StateProvinceCode = orig.sc;
      address.PostalCode = orig.pin;
      address.CountryCode = orig.cc;
      shipper.Address = address;
      shipment['Shipper'] = shipper;

    //  shipto['Name'] = 'Imani Imaginarium';
      //addressTo['AddressLine'] = '21 ARGONAUT SUITE B';
     // addressTo['City'] = 'ALISO VIEJO';
      addressTo['StateProvinceCode'] = dest.sc;
      addressTo['PostalCode'] = dest.pin;
      addressTo['CountryCode'] = dest.cc;
      addressTo['ResidentialAddressIndicator'] = '';
      shipto['Address'] = addressTo;
      shipment['ShipTo'] = shipto;

      shipfrom['Name'] = 'Imani Imaginarium';
      addressFrom['AddressLine'] = Array
      (
          'Southam Rd',
          '4 Case Court',
          'Apt 3B'
      );
      addressFrom['City'] = 'Timonium';
      addressFrom['StateProvinceCode'] = orig.sc;
      addressFrom['PostalCode'] = orig.pin;
      addressFrom['CountryCode'] = orig.cc;
      shipfrom['Address'] = addressFrom;
      shipment['ShipFrom'] = shipfrom;
		
	var service={},packaging1={},dunit1={},package1={},dimensions1={},punit1={},packageweight1={};
      service['Code'] = '03';
      service['Description'] = 'Service Code';
      shipment['Service'] = service;

      packaging1['Code'] = '02';
      packaging1['Description'] = 'Rate';
      package1['PackagingType'] = packaging1;
      dunit1['Code'] = 'IN';
      dunit1['Description'] = 'inches';
      dimensions1['Length'] = pack.pl;
      dimensions1['Width'] = pack.pw;
      dimensions1['Height'] = pack.ph;
      dimensions1['UnitOfMeasurement'] = dunit1;
      package1['Dimensions'] = dimensions1;
      punit1['Code'] = 'LBS';
      punit1['Description'] = 'Pounds';
      packageweight1['Weight'] = pack.w;
      packageweight1['UnitOfMeasurement'] = punit1;
      package1['PackageWeight'] = packageweight1;
	  
      shipment['Package'] = Array(	package1 );
      shipment['ShipmentServiceOptions'] = '';
      shipment['LargePackageIndicator'] = '';
      ureq.Shipment = shipment;
	  //console.log(ureq);
      
	  var upss = {};
	  
    upss['UsernameToken'] = {"Username":"aanto@gmu.edu","Password":"0653Kerala1" };
    upss['ServiceAccessToken'] = {"AccessLicenseNumber": "ED529B220C21DE75"};
	  
	return { path: api, param: { UPSSecurity:upss,RateRequest: ureq} } 

}

module.exports = { prepare,result}