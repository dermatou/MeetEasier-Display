module.exports = function (callback) {

  // modules -------------------------------------------------------------------
  var ews = require("ews-javascript-api");
  var XhrApi = require("@ewsjs/xhr").XhrApi;
  var auth = require("../../config/auth.js");

  // xhr ----------------------------------------------------------------------
  var xhr = new XhrApi({rejectUnauthorized: false}).useNtlmAuthentication(auth.exchange.username, auth.exchange.password);
  ews.ConfigurationApi.ConfigureXHR(xhr);

  // ews -----------------------------------------------------------------------
  var exch = new ews.ExchangeService(ews.ExchangeVersion.Exchange2016);
  exch.AcceptGzipEncoding = false;
  exch.Credentials = new ews.WebCredentials(auth.exchange.username, auth.exchange.password);
  exch.Url = new ews.Uri(auth.exchange.uri);

  // get roomlists from EWS and return sorted array of room list names
  exch.GetRoomLists().then((lists) => {
    var roomLists = [];

    lists.items.forEach(function (item, i, array) {
      roomLists.push(item.Name);
    });
    callback(null, roomLists.sort());
  }, (err) => {
    callback(err, null);
  });

};
