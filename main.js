const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'http://digipay.webreport.info/harga.js.php?id=fad9ced6428d496161e097a1f74357bc9933e953c350cf03a453828bc33fad8386cec34a87532aa3065695d79f288610-5';

async function getData(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const tables = $('table.tabel');

  tables.each(function() {
    const tableHeaders = $(this).find('.head');
    const headerTitle = tableHeaders.eq(0).text().trim().toLowerCase();
    const itemKeys = tableHeaders.eq(1).children().map(function() {
      return $(this).text().trim().toLowerCase();
    }).get();

    let data = [];
    $(this).find('tr').not('.head').each(function() {
      if (!$(this).children().length) {
        return;
      }

      let rowData = {
        headers: headerTitle,
      };

      $(this).children().each(function(cellIndex, cellItem) {
        rowData[itemKeys[cellIndex]] = $(cellItem).text().trim().toLowerCase();
      }).get();

      data.push(rowData);
    });

    console.log(data);
  })
}

getData(URL);
