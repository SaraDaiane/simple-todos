import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';

 
import './body.html';
 
Template.body.helpers({
  tasks() {
    // Show newest tasks at the top
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },
});