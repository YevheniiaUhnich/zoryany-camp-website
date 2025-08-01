const sheetName = 'Form SchCns'
const scriptProp = PropertiesService.getScriptProperties()

function intelSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
  Logger.log('Setup completed. Spreadsheet ID: ' + activeSpreadsheet.getId())
  
  // Логуємо всі доступні аркуші
  const sheets = activeSpreadsheet.getSheets()
  Logger.log('Available sheets:')
  sheets.forEach((sheet, index) => {
    Logger.log(index + ': "' + sheet.getName() + '"')
  })
}

function doGet(e) {
  Logger.log('doGet called with parameters: ' + JSON.stringify(e.parameter))
  return processFormData(e.parameter)
}

function doPost(e) {
  Logger.log('doPost called with parameters: ' + JSON.stringify(e.parameter))
  return processFormData(e.parameter)
}

function processFormData(parameters) {
  Logger.log('processFormData called with: ' + JSON.stringify(parameters))
  
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    Logger.log('=== START PROCESSING ===')
    Logger.log('Parameters received: ' + JSON.stringify(parameters))
    
    // Детальне логування кожного параметра
    Logger.log('=== PARAMETER DETAILS ===')
    for (const [key, value] of Object.entries(parameters)) {
      Logger.log(key + ': "' + value + '"')
    }
    Logger.log('========================')
    
    const spreadsheetId = scriptProp.getProperty('key')
    Logger.log('Spreadsheet ID from properties: ' + spreadsheetId)
    
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not found. Please run intelSetup() first.')
    }
    
    const doc = SpreadsheetApp.openById(spreadsheetId)
    Logger.log('Spreadsheet opened successfully')
    
    // Логуємо всі доступні аркуші
    const sheets = doc.getSheets()
    Logger.log('Available sheets in spreadsheet:')
    sheets.forEach((sheet, index) => {
      Logger.log(index + ': "' + sheet.getName() + '"')
    })
    
    const sheet = doc.getSheetByName(sheetName)
    Logger.log('Looking for sheet: "' + sheetName + '"')
    Logger.log('Sheet found: ' + (sheet ? 'YES' : 'NO'))
    
    if (!sheet) {
      throw new Error('Sheet "' + sheetName + '" not found. Available sheets: ' + sheets.map(s => s.getName()).join(', '))
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    Logger.log('Headers found: ' + JSON.stringify(headers))
    
    const nextRow = sheet.getLastRow() + 1
    Logger.log('Next row will be: ' + nextRow)
    
    // Використовуємо нові назви параметрів
    const newRow = []
    
    // Імʼя (перший стовпець) - використовуємо 'fname'
    newRow.push(parameters['fname'] || '')
    Logger.log('Column 0 (Імʼя): "' + (parameters['fname'] || '') + '"')
    
    // Прізвище (другий стовпець) - використовуємо 'lname'
    newRow.push(parameters['lname'] || '')
    Logger.log('Column 1 (Прізвище): "' + (parameters['lname'] || '') + '"')
    
    // Телефон (третій стовпець)
    newRow.push(parameters['phone'] || '')
    Logger.log('Column 2 (Телефон): "' + (parameters['phone'] || '') + '"')
    
    // Email (четвертий стовпець)
    newRow.push(parameters['email'] || '')
    Logger.log('Column 3 (Email): "' + (parameters['email'] || '') + '"')
    
    // Мотивація (п'ятий стовпець)
    newRow.push(parameters['motivation'] || '')
    Logger.log('Column 4 (Мотивація): "' + (parameters['motivation'] || '') + '"')
    
    // Додаємо дату, якщо є стовпець Date
    if (headers.length > 5 && headers[5] === 'Date') {
      newRow.push(new Date())
      Logger.log('Column 5 (Date): current date')
    }

    Logger.log('New row data: ' + JSON.stringify(newRow))
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
    Logger.log('Data written to row ' + nextRow)

    return ContentService.createTextOutput(JSON.stringify({ 'result' : 'success', 'row': nextRow}))
    .setMimeType(ContentService.MimeType.JSON)
  }
  catch(error) {
    Logger.log('ERROR: ' + error.toString())
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString()}))
    .setMimeType(ContentService.MimeType.JSON)
  }
  finally {
    lock.releaseLock()
    Logger.log('=== END PROCESSING ===')
  }
} 
