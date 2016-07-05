import {Meteor} from 'meteor/meteor';

import {Template} from 'meteor/templating';

import './body.html';

import {ReactiveDict} from 'meteor/reactive-dict';

import './task.js';

import {Tasks} from '../api/tasks.js';

Template.body.helpers({
	tasks(){
		const instance=Template.instance();
		if (instance.state.get('hideCompleted')){
			return Tasks.find({checked:{$ne:true}},{sort:{createAt:-1}});
		}
		return Tasks.find({},{sort:{createAt:-1}});
	},
	incomlpeteCount(){
		return Tasks.find({checked:{$ne:true}}).count();
	},
});

Template.body.onCreated(function bodyOnCreated(){
	this.state=new ReactiveDict();
})


Template.body.events({
	'submit .new-task'(event){
		event.preventDefault();

		const target=event.target;
		const text=target.text.value;
		Tasks.insert({
			text,
			createdAt:new Date(),
			owner:Meteor.userId(),
			username:Meteor.user().username,
		});
		//clear form
		target.text.value="";
	},
	'change .hide-completed input'(event,instance){
		instance.state.set('hideCompleted',event.target.checked);
	},
});

