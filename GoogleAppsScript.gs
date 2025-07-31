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
  return doPost(e)
}

function doPost(e) {
  Logger.log('doPost called with parameters: ' + JSON.stringify(e.parameter))
  
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    Logger.log('=== START PROCESSING ===')
    Logger.log('Parameters received: ' + JSON.stringify(e.parameter))
    
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
    
    // Мапінг латинських параметрів на українські заголовки
    const parameterMapping = {
      'firstName': 'Імʼя',
      'lastName': 'Прізвище', 
      'phone': 'Телефон',
      'email': 'Email',
      'motivation': 'Мотивація'
    }
    
    const newRow = headers.map(function(header, index) {
      if (header === 'Date') {
        Logger.log('Column ' + index + ': Date field, setting current date')
        return new Date()
      }
      
      // Знаходимо латинський параметр для цього заголовка
      for (const [latParam, ukrHeader] of Object.entries(parameterMapping)) {
        if (ukrHeader === header) {
          const value = e.parameter[latParam] || ''
          Logger.log('Column ' + index + ': ' + header + ' -> ' + latParam + ' = ' + value)
          return value
        }
      }
      
      const value = e.parameter[header] || ''
      Logger.log('Column ' + index + ': ' + header + ' = ' + value)
      return value
    })

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
