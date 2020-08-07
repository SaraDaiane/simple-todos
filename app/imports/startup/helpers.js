import { Template } from 'meteor/templating';
import moment from 'moment';
import { check } from 'meteor/check';

Template.registerHelper('formataDataBrasileira', function (previsao) {
  console.log();
  check(previsao, Date);
  return moment(previsao).utc().format('DD - MM - YYYY');
});