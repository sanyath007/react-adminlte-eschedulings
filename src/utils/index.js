import moment from 'moment';

export const calcAge = (birthday) => {
  const now = moment();
  const birth = moment(birthday, 'YYYY');

  return now.diff(birth, 'years');
};

export const mapHWardToWard = (ward) => {
  switch (ward) {
    case '00':
      return '2';    
    case '05':
      return '3'    
    case '06':
      return '1'
    default:
      break;
  }
};

export const addBodyClass = className => document.body.classList.add(className);
export const removeBodyClass = className => document.body.classList.remove(className);

export const lastDayOfMonth = function(strDate) {
  if(!strDate) return 31;

  return parseInt(moment(strDate).endOf('month').format('DD'));
};

export const createDailyCategories = function() {
  return new Array(24);
};

export const createMonthlyCategories = function(month) {
  if(!month) return new Array(31)
  
  let endDate = lastDayOfMonth(`${month}-01`);

  return new Array(endDate);
};

export const createDataSeries = function(data, dataProps, catType) {
  let dataSeries = [];
  let categories = [];
  let catValue = 0;

  if(catType.name == 'd') {
      categories = createDailyCategories();
  } else if (catType.name == 'm') {
      categories = createMonthlyCategories(catType.value);
  }

  for(let i = 0; i < categories.length; i++) {
      if(catType.name == 'd') {
          catValue = i;
      } else if (catType.name == 'm') {
          catValue = i+1;
      }

      categories[i] = `${catValue}`;
      dataSeries.push(0);

      data.every((val, key) => {
          if(parseInt(val[dataProps.name]) === catValue) {
              dataSeries[i] = parseInt(val[dataProps.value]);
              return false;
          }

          return true;
      });
  }

  return { dataSeries, categories }
};
