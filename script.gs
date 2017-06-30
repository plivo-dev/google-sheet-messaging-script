var AUTH_ID = 'XXX.YOUR.AUTH_ID.XXX';                                                                           // put your plivo auth id here
var AUTH_TOKEN = 'XXXXXXXXXXXX.YOUR.AUTH_TOKEN.XXXXXXXXXXX';                                                    // put your plivo auth token her         
var columnNum = 0;                                                                                              // number of no meta calumns
var rowNum = 0;                                                                                                 // number of rows of data
var template = '';                                                                                              // Template String
var active_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();                                                 // active spreadSheet
var sheet = active_spreadsheet.getSheetByName("Data");                                                          // Sheet containing the data,headers,meta_headers
var template_sheet;                                                                                             // Spreadsheet sheet containing the template
var width_of_sheet = 'Z';                                                                                       // You can enter the Data till column 'Z' only
var height_of_sheet = 999;                                                                                      // You can enter the Data till row 999 only
var num_of_meta_column = 4;                                                                                     // total number of meta columns
var pre_defined_columns = [                                                                                     // list of predefined columns
  'API_ID',
  'HTTP_STATUS_CODE',
  'MESSAGE_STATUS',
  'MESSAGE_UUID',
  'SOURCE',
  'DESTINATION',
  'NAME',
  'STORE',
  'DISCOUNT',
  'COUPON_CODE'
];
var STATIC = {
  "DATA_SHEET_WARNING": "WARNING: SHEET NAMED 'Data' NEEDED \n\n Could not find the sheet Named 'Data', hence creating the sheet. \n'Data' sheet will be used to store your data. Do not rename or delete 'Data' sheet",
  "TEMPLATE_SHEET_WARNING": "WARNING: SHEET NAMED 'Template' NEEDED \n\n Could not find the sheet Named 'Template', hence creating the sheet. \n'Template' sheet will be used to store your SMS template. Do not rename or delete 'Template' sheet",
  "TEMPLATE_SHEET_ERROR": "SHEET ERROR : MISSING SHEET 'Template'.\n\n Can't find the sheet containing the SMS template . Please make sure\n you have not deleted or renamed the sheet named 'Template' \n if you have deleted it by mistake , try reloading the sheet and \n you will get your template sheet created for you with the dummy SMS template",
  "DATA_SHEET_ERROR": "SHEET ERROR : MISSING SHEET 'Data'. \n\n Can't find the sheet containing the data . Please make sure\n you have not deleted or renamed the sheet named 'Data' \n if you have deleted or renamed it by mistake , try reloading the sheet and \n you will get your Data sheet created for you with the predifened columns",
  "TEMPLATE_ERROR":"TEMPLATE VLIDATION ERROR : TEMPLATE USING MISSING PLACEHOLDERS. \n\n Few placeholders are invalid as they have been used in template but does not exist as \n column in Data sheet. The tokens are case-sensitive , so you should check that too. \n Those Invalid placeholders are : \n",
  "TEMPLATE_MISSING_ERROR":"MISSING TEMPLATE : NO TEMPLATE FOUND \n\n No SMS template exists at cell A2 of 'Template' sheet",
  "DATA_ERROR":"DATA ERROR : COLUMN(S) CONTAIN EMPTY OR INVALID DATA\n\n Few cells doesn't contain valid data or are blank . Please review the highlighted cell(s)",
  "HEADER_MISSING_ERROR":"HEADER ERROR: COLUMN 'SOURCE' OR 'DESTINATION' NOT FOUND \n\n Please make sure that there must be two columns named as 'SOURCE' and\n 'DESTINATION' and all the other columns should be added after these colums",
  "HEADER_INVALID_ERROR":"HEADER ERROR: FEW COLUMN HEADERS CONTAIN SPACES  \n\n Please make sure that columns must not contain spaces (' ').\n You can use underscore ('_') instead",
  "STARTER_TEMPLATE":"Hi {{NAME}} , use coupon code {{COUPON_CODE}} to avail a {{DISCOUNT}}% discount on your next purchase at {{STORE}}!",
  "DATA_VALIDATION_SUCCESS":{
    "TITLE":"",
    "DETAIL":""
  },
  "TEMPLATE_VALIDATION_SUCCESS":{
    "TITLE":"Your template has been validated ",
    "DETAIL":"Your final message should not exceed the length of 1600 characters otherwise that message will be rejected."
  },
  "COLORS":{
    "FONT":{
      "EDITABLE_AREA":"#000",
      "HEADER":"#fff",
      "META_COLUMN":"#656565",
      "TEMPLATE_CELL":"#fff",
      "TEMPLATE_TITLE_CELL":"#fff",
      "API_ERROR_ROW":"#000",
      "API_SUCCESS_ROW":"#000"
    },
    "BACKGROUND":{
      "EDITABLE_AREA":"#fff",
      "HEADER":"#43a047",
      "META_COLUMN":"#fdfdfd",
      "TEMPLATE_CELL":"#d77914",
      "TEMPLATE_TITLE_CELL":"#43a047",
      "API_ERROR_ROW":"#f5afa7",
      "API_SUCCESS_ROW":"#bdf5a7"
    }
  }
}
/*-------------------------------------------------------------------*/
// when this script wil be installed , this function will be called
function onInstall(){
  onOpen();
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// This function is called on Opening the sheet and all the colors and 
// predefined headers are setup
function onOpen() {
  // create the menu
  SpreadsheetApp.getUi()
    .createMenu('Plivo Messaging')
    .addItem('Validate Message Template','validateTemplate')
    .addItem('Send Messages','initiate')
    .addSeparator()
    .addItem('Show Response Columns','unhideMetaColumns')
    .addItem('Hide Response Columns','hideMetaColumns')
    .addItem('Clear Data','clearAll')
    .addToUi();
 
  // set up the data sheet
  // if the data sheet is not present then one will be created
  sheet = active_spreadsheet.getSheetByName("Data");
  if (sheet == null) {
    popupAlert(STATIC.DATA_SHEET_WARNING,false);
    active_spreadsheet.insertSheet('Data');
    sheet = active_spreadsheet.getSheetByName("Data");
  }
  // set up the template sheet 
  // if the template sheet is not present then one will be created
  template_sheet = active_spreadsheet.getSheetByName("Template");
  if (template_sheet == null) {
    popupAlert(STATIC.TEMPLATE_SHEET_WARNING,false);
    active_spreadsheet.insertSheet('Template');
    template_sheet = active_spreadsheet.getSheetByName("Template");
  }
  // Put some example template
  if(template_sheet.getRange("A2").isBlank()){
    template_sheet.getRange("A2").setValue(STATIC.STARTER_TEMPLATE); 
  }
  // Styling the template title cell
  template_sheet.getRange("A1")
    .setValue("SMS TEMPLATE")
    .setFontColor(STATIC.COLORS.FONT.TEMPLATE_TITLE_CELL)
    .setBackground(STATIC.COLORS.BACKGROUND.TEMPLATE_TITLE_CELL)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center");
  // Styling the template cell
  template_sheet.getRange("A2")
    .setFontColor(STATIC.COLORS.FONT.TEMPLATE_CELL)
    .setBackground(STATIC.COLORS.BACKGROUND.TEMPLATE_CELL)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setWrap(true);
  // setting up width and height of template sheet
  template_sheet
    .setColumnWidth(1,800)
    .setRowHeight(2,80)
    .setRowHeight(1,30);
  
  // get the data sheet of your spreadsheet app.
  sheet = active_spreadsheet.getSheetByName("Data");
  
  // hide the meta columns
  hideMetaColumns();

  // freeze the header row . Make it sticky
  sheet.setFrozenRows(1);
  
  // set the active sheet as the data sheet for list of source and destination number
  active_spreadsheet.setActiveSheet(sheet);

  // Initialize the header for pre defined columns like status, message uuid,Source and destination etc. 
  for(var i=0;i<pre_defined_columns.length;i++){
    sheet
      .getRange(String.fromCharCode(65 + i)+"1")
      .setValue(pre_defined_columns[i]);
  }
  
  //set height and width of the data sheet
  for(var i=1; i<=height_of_sheet; i++){
     sheet.setRowHeight(i, 35);
  }
  
  for(var i=1; i<=width_of_sheet.charCodeAt(0) - 64;i++){
    if(i<=num_of_meta_column)
      sheet.autoResizeColumn(i);
    else
      sheet.setColumnWidth(i,100);
  }

  // set up each cell with text aligned center
  sheet.getRange("A1:"+width_of_sheet+height_of_sheet)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center");

  // change the style of header , background and font color
  var header = sheet.getRange("A1:"+width_of_sheet+"1");
  header
    .setFontColor(STATIC.COLORS.FONT.HEADER)
    .setBackground(STATIC.COLORS.BACKGROUND.HEADER)
    .setBorder(false, true, false, true, false, false, STATIC.COLORS.BACKGROUND.HEADER, null);
  
  // change the style n look of the meta columns which will tell us the status and details of our SMS
  var status_cell = sheet.getRange("A2:"+(String.fromCharCode(65 + num_of_meta_column-1))+height_of_sheet);
  status_cell
    .setFontColor(STATIC.COLORS.FONT.META_COLUMN)
    .setBackground(STATIC.COLORS.BACKGROUND.META_COLUMN);
    
  // give style to the area which will contain the input data.  
  var editable_area = sheet.getRange((String.fromCharCode(65 + num_of_meta_column))+"2:"+width_of_sheet+height_of_sheet);
  editable_area
    .setBackground(STATIC.COLORS.BACKGROUND.EDITABLE_AREA)
    .setFontColor(STATIC.COLORS.FONT.EDITABLE_AREA);
}
/*-------------------------------------------------------------------*/


/*-------------------------------------------------------------------*/
// Initiates the process of sending the messages It first checks
// if the template is valid and then if the data sheet is valid
// then it starts the finalising process of loading the template
// and start the message api calls
function initiate(){
  if(validateTemplate().result){
    var validatedData = validateData();
    if(validatedData.result){
      setTemplate(validateTemplate().data,validatedData.data);
    }
  }
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function makes sure that both the sheets('data' and 'template') 
// are present
function validateSheet(){
  template_sheet = active_spreadsheet.getSheetByName("Template");
  if(template_sheet == null){
      popupAlert(STATIC.TEMPLATE_SHEET_ERROR,false);
      return false;
  }
  sheet = active_spreadsheet.getSheetByName("Data");
  if(sheet == null){
      popupAlert(STATIC.DATA_SHEET_ERROR,false);
      return false;
  }
  return true;
}
/*-------------------------------------------------------------------*/


/*-------------------------------------------------------------------*/
// validate the template for the SMS and check if doesn't use any 
// placeholder that isn't present as column in the data sheet.
function validateTemplate(){
  // validate both the sheets;
  var falseResponse = {"data" : null,"result" : false};
  // validate both the sheets
  if(!validateSheet())
    return falseResponse;
  // validate headers of data
  if(!validateHeader())
    return falseResponse;
  // get the template text
  if(template_sheet.getRange("A2").isBlank()){
    popupAlert(STATIC.TEMPLATE_MISSING_ERROR,false);
    return falseResponse
  }
  var text = template_sheet.getRange("A2").getValue();
  // test the placeholders
  
  var data_columns = [];
  var template_tokens = text.match(/\{\{.+?\}\}/gi);
  var placeholder_result = true;
  var unmatched_tokens = [];
  if(template_tokens && template_tokens.length > 0){
    data_columns = getHeaders();
    for(var i=0;i<template_tokens.length;i++){
      var token = template_tokens[i].replace(/{/g, "").replace(/}/g, "")
      if(data_columns.indexOf(token.trim())==-1){
        placeholder_result = false;
        unmatched_tokens.push(token);
      }
    }
  }
  
  // show message according to the placeholder's and template validation
  if(!placeholder_result)    
    popupAlert(STATIC.TEMPLATE_ERROR+unmatched_tokens.join(','),false);
  else
    active_spreadsheet.toast(STATIC.TEMPLATE_VALIDATION_SUCCESS.DETAIL,STATIC.TEMPLATE_VALIDATION_SUCCESS.TITLE,5);
  return {
    'result':placeholder_result,
    'data':text
  }
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function validates the data in the sheet to check if the values 
// for the columns exists and are valid
function validateData(){
  var falseResponse = {"data" : null,"result" : false};
  // validate both the sheets
  if(!validateSheet())
    return falseResponse;
  if (!validateHeader()){
    return falseResponse;
  }
  rowNum = 0;
  columnNum = getHeaders().length;
  var range = sheet.getRange("A1:"+width_of_sheet+height_of_sheet);  
  var editable_area = sheet.getRange((String.fromCharCode(65 + num_of_meta_column))+"2:"+width_of_sheet+height_of_sheet);
  editable_area.setBackground("#fff");
  var table = [];
  var result = true;
  for(var i=2;;i++){
    var good_cell = 0; 
    var bad_cell = 0;
    var row = {"row":i};
    for(j=num_of_meta_column+1;j<=num_of_meta_column+columnNum;j++){
      if(!range.getCell(i,j).isBlank()){
        good_cell++;
        row[variablise(range.getCell(1,j).getValue())] = range.getCell(i,j).getValue();
        if(j <= num_of_meta_column+2 && !isValidPhone(range.getCell(i,j).getValue())){
          result = false;
          range.getCell(i,j).setBackground('#f5afa7');
        }
      }else{
        bad_cell++;
        row[variablise(range.getCell(1,j).getValue())] = "";
        range.getCell(i,j).setBackground('#f5afa7');
      }
    }
    if(good_cell==0){
      sheet.getRange(String.fromCharCode(65 + num_of_meta_column)+i+":"+String.fromCharCode(65 + num_of_meta_column+columnNum)+i).setBackground('#fff');
      break;
    }else if(bad_cell!=0){
      result = false;
    }
    rowNum++;
    table.push(row);
  }
  
  if(!result){
    popupAlert(STATIC.DATA_ERROR,false);
  }
  return {
    "data" : table,
    "result" : result
  }
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function finalizes the sending of the template and start the
// SMS sending process if the user confirms  
function setTemplate(t,data){
  template = t;
  var response = popupAlert('Are you sure you want to continue?',true);
  var ui = SpreadsheetApp.getUi();
  if (response == ui.Button.YES) {
    sendMessages(data);
  }
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this is the function which takes the sheet data and call the api 
// one by one for each row of the data . It also gives the report of 
// how many rows successfully processed and how many of them failed
function sendMessages(data){
  var success = 0;
  var failure = 0;
  var TOKEN = Utilities.base64Encode(AUTH_ID+":"+AUTH_TOKEN);
  for(i=0;i<data.length;i++){
    var row = data[i];
    var tempObj = {
        "src":row['SOURCE'],
        "dst":row['DESTINATION'],
        "text":createMessage(row,template),
    }
    var delivered = trySMS(tempObj,row.row,AUTH_ID,TOKEN);
    delivered?success++:failure++;
  }
  popupAlert("FINAL REPORT : \n\n"+(success+failure)+" row(s) processed \n "+success+" row(s) executed successfully \n "+failure+" row(s) encountered error \n For further details please check api details or each row in the sheet. ",false);
  unhideMetaColumns();
}
/*-------------------------------------------------------------------*/


/*-------------------------------------------------------------------*/
// this function takes a string and returns a string with all the 
// spaces replaced from that string . This can be used if Dealing
// with Headers containing spaces
function variablise(key){
  return key.replace(/ /g, "_");
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function takes as the parameter , the list of placeholders
// available for the template and the template text . It returns the 
// final message by replacing the placeholders in the template with 
// the actual value 
function createMessage(data,template_data){
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
        template_data = template_data.replace(new RegExp('{{'+key+'}}', 'gi'),data[key]);
    }
  }
  return template_data;
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// a utility function that will return back the alert to show . It 
// takes as params , the text to show in the popup and the boolean 
// if button is needed or not
function popupAlert(text,is_button){
  var ui = SpreadsheetApp.getUi();
  if(is_button)
    return ui.alert(text, ui.ButtonSet.YES_NO);
  else
    return ui.alert(text);  
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// get all the headers which are not the predefined meta columns and 
// return the List of columns
function getHeaders(){
  var data_columns = [];
  for(var j=num_of_meta_column+1;j<=(width_of_sheet.charCodeAt(0) - 65 + 1);j++){
    if(!sheet.getRange(1,j).isBlank()){
      data_columns.push(sheet.getRange(1,j).getValue().trim());
    }else{
      break;
    }
  }
  return data_columns;
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function validates the header in the data sheet to check if the 
// first and second column are 'SOURCE' and 'DESTINATION'
function validateHeader(){
  var header = getHeaders();
  if(header < 2){
     popupAlert(STATIC.HEADER_MISSING_ERROR,false);
     return false;
  }else{
    if(header[0] != 'SOURCE' || header[1] != 'DESTINATION'){
      popupAlert(STATIC.HEADER_MISSING_ERROR,false);
      return false;
    }
  }
  
  for(var i = 0;i< header.length;i++){
    var spaceMatch = header[i].trim().match(/ /gi);
    if (spaceMatch!=null && spaceMatch.length > 0 ){
      popupAlert(STATIC.HEADER_INVALID_ERROR,false);
      return false;
    }
  }
  return true;
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// check the validity of the phone number column containing the 
// source and destination phone numbers
function isValidPhone(phno){
  return /^([0-9]{7,})$/.test(phno);
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this will make the api call to the plivo message api and get the 
// response of the api call . This method needs the TOKEN for basic 
// auth which be genearated by base64 encoding of the string made up
// by "AUTH_ID:AUTH_TOKEN"
function trySMS(task,row,AUTH_ID,TOKEN){
   var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers':{
      Authorization:"Basic "+ TOKEN
    },
    'muteHttpExceptions':true,
    'payload' : JSON.stringify(task)
  };
  response = UrlFetchApp.fetch('https://api.plivo.com/v1/Account/'+AUTH_ID+'/Message/', options);
  return setStatus(response,row);
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// this function will run after the each api call of message and it
// will set the status of the message api call and also highlight the
// successful and failed rows for the message api call.
function setStatus(response,row){
  var resp = JSON.parse(response.getContentText());
  var sheet = active_spreadsheet.getSheetByName('Data');
  var api_id = "A"+(row);
  var status = "C"+(row);
  var uuid = "D"+(row);
  var response_code = "B"+(row);
  
  if(response.getResponseCode()==202){
    sheet.getRange(api_id).setValue(resp.api_id);
    sheet.getRange(status).setValue(resp.message);
    sheet.getRange(uuid).setValue(resp.message_uuid[0]);
    sheet.getRange(response_code).setValue(response.getResponseCode());
    sheet.getRange(String.fromCharCode(65 + num_of_meta_column)+row+":"+width_of_sheet+row).setBackground('#bdf5a7');
    return true;
  }else{
    sheet.getRange(api_id).setValue(resp.api_id);
    sheet.getRange(uuid).setValue('failed');
    sheet.getRange(status).setValue(resp.error);
    sheet.getRange(response_code).setValue(response.getResponseCode());
    sheet.getRange(String.fromCharCode(65 + num_of_meta_column)+row+":"+width_of_sheet+row).setBackground('#f5afa7');  
    return false;
  }
}
/*-------------------------------------------------------------------*/

/*--------------------------CLEAR ALL--------------------------------*/
// this function will clear all the data except the headers .
// It can be used when you need to input new set of messages .
function clearAll(){
  var response = popupAlert('Are you sure you want to continue?',true);
  var ui = SpreadsheetApp.getUi();
  if (response == ui.Button.YES) {
    sheet.getRange("A2:"+width_of_sheet+height_of_sheet).setValue("");
  }
}
/*-------------------------------------------------------------------*/

/*-------------------------------------------------------------------*/
// these functions hide and show the columns which gives the details of 
// the api response like api_id , uuid , status
function hideMetaColumns(){
  for(var i=1;i<=num_of_meta_column;i++){
    sheet.hideColumns(i);
  }
}
function unhideMetaColumns(){
  for(var i=0;i<num_of_meta_column;i++){
    sheet.unhideColumn(sheet.getRange(String.fromCharCode(65 + i)+'1'));
  }
}
/*-------------------------------------------------------------------*/

