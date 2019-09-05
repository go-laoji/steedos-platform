db.categories = new Meteor.Collection('categories');
db.flows = new Meteor.Collection('flows');
db.flow_instances = new Meteor.Collection('flow_instances');
db.forms = new Meteor.Collection('forms');
db.instances = new Meteor.Collection('instances');
db.instance_traces = new Meteor.Collection('instance_traces');
db.form_versions = new Meteor.Collection('form_versions');
db.flow_versions = new Mongo.Collection("flow_versions");
db.space_user_signs = new Mongo.Collection("space_user_signs");
db.flow_positions = new Mongo.Collection("flow_positions");
db.flow_roles = new Mongo.Collection("flow_roles");
db.instance_number_rules = new Mongo.Collection("instance_number_rules");
db.process_delegation_rules = new Mongo.Collection("process_delegation_rules");
db.webhooks = new Mongo.Collection("webhooks");
db.my_approves = new Meteor.Collection('my_approves');
