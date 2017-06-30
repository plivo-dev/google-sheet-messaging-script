# google-sheet-messaging-script
Send templatized SMS from a Google spreadsheet using Plivo SMS API

#### Steps to use

###### 1. Create a new google sheet with any name you want.


###### 2. Open script editor

![Go to script editor](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-2.png "Go to script editor")


###### 3. Copy the code from `script.gs` and paste it into the google script editor.

![Paste the code](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-24.png "Paste the code")


###### 4. Put your proper `AUTH_ID` and `AUTH_TOKEN` in the place specified.

![Fill your credentials](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-23.png "Fill your credentials")

###### 4. Save the code with any project name.

![Save the code](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-5.png "Save the code")


###### 5. Reload the sheet and it will create the boilerplate for you.

![sheet named 'Data' will be created if not present](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-7.png "sheet named 'Data' will be created if not present")

Sheet named 'Data' will be created if not present.

___

![sheet named 'Template' will be created if not present](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-8.png "sheet named 'Template' will be created if not present")

Sheet named 'Template' will be created if not present.

___


![Data sheet](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-10.png "Data sheet")

After both the sheets will be created , you will see few columns created in 'Data' sheet . The highlighted ones are called the meta columns which will be populated with the details of the message delivery api for that specific row. Meta columns, `SOURCE` and `DESTINATION` columns here a mandatory and the script won't allow you to send messages if they are not present.

___


![Template](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-11.png "Template")

'Template' sheet will have SMS template in the 'A2' cell (orange) . One example has been created for your reference and you can change it to any valid template(see the next step for more details about valid template).

###### 5. Add your headers.
![Template](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-10.png "Template")

###### 6. Edit you template.
![Template](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-11.png "Template")

###### 7. Validate your SMS template.
![Template validation](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-14.png "Template validation")

###### 8. Put your data in the sheet.
![Put your data](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-19.png "Put your data")

###### 9. Send messages.
![Send messages](https://s3.amazonaws.com/plivo_blog_uploads/static_assets/images/blog/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging/Plivo-SMS-google-sheet-integrations-by-google-script-plivo-messaging-17.png "Send Messages")


___

You might need to authorize your account to run the script due to Google's security reasons. Also,few capabilities of Plivo Messaging scripts (like numbers of API call per day via Single account , etc) are subject to availability of your google account daily quotas for `Google Script`. Please refer to [Quotas of google services](https://developers.google.com/apps-script/guides/services/quotas) page for more details.


<!-- Read more about our script on our blog  [https://plivo.com/blog/Send-templatized-SMS-from-a-Google-spreadsheet-using-Plivo-SMS-API/](https://plivo.com/blog/Send-templatized-SMS-from-a-Google-spreadsheet-using-Plivo-SMS-API/) page for more details.
 -->