import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './body.html';

Template.body.onCreated(function bodyOnCreated () {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks () {
    const instance = Template.instance();
    const hideCompleted = instance.state.get('hideCompleted');
    const search = instance.state.get('search');

    let filtro = {};

    // quando é pra ocultar as completas
    if (hideCompleted) {
      // If hide completed is checked, filter tasks
      filtro = { ...filtro, checked: { $ne: true } };
    }

    // quando tem valor no campo de busca
    if (search) {
      // If hide completed is checked, filter tasks
      filtro = {
        ...filtro, text: { $regex: search, $options: 'gi' },
      };
    }
    // Show newest tasks at the to
    return Tasks.find(filtro, { sort: { previsao: 1 } });
  },
  incompleteCount () {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit #formInsercao' (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const previsao = target.previsao.value;

    Meteor.call('tasks.insert', text, new Date(previsao));

    // Clear form
    target.text.value = '';
    target.previsao.value = '';
  },
  'change .hide-completed input' (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'input #inputSearch' (event, instance) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const search = event.target.value;
    instance.state.set('search', search);
  },

});