import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';

export default class Gantt extends Component {
	componentDidMount() {
		gantt.config.xml_date = "%Y-%m-%d %H:%i";
		const { tasks } = this.props;
		gantt.init(this.ganttContainer);
		this.initGanttDataProcessor();
		gantt.parse(tasks);
	}

	render() {
		const { zoom } = this.props;
		this.setZoom(zoom);
		return (
		<div
			ref={(input) => { this.ganttContainer = input }}
			style={{ width: '100%', height: '100%' }}
		></div>
		);
	}

	setZoom(value) {
		switch (value) {
			case 'Hours':
				gantt.config.scale_unit = 'day';
				gantt.config.date_scale = '%d %M';
				gantt.config.scale_height = 60;
				gantt.config.min_column_width = 30;
				gantt.config.subscales = [
					{ unit:'hour', step:1, date:'%H' }
				];
			break;
			case 'Days':
				gantt.config.min_column_width = 70;
				gantt.config.scale_unit = 'week';
				gantt.config.date_scale = '#%W';
				gantt.config.subscales = [
					{ unit: 'day', step: 1, date: '%d %M' }
				];
				gantt.config.scale_height = 60;
			break;
			case 'Months':
				gantt.config.min_column_width = 70;
				gantt.config.scale_unit = 'month';
				gantt.config.date_scale = '%F';
				gantt.config.scale_height = 60;
				gantt.config.subscales = [
					{ unit:'week', step:1, date:'#%W' }
				];
			break;
			default:
			break;
		}
	}

	initGanttDataProcessor() {
		const onDataUpdated = this.props.onDataUpdated;
		this.dataProcessor = gantt.createDataProcessor((entityType, action, item, id) => {
			return new Promise((resolve, reject) => {
				if (onDataUpdated) {
					onDataUpdated(entityType, action, item, id);
				}
				return resolve();
			});
		});
	}
	componentWillUnmount() {
		if (this.dataProcessor) {
			this.dataProcessor.destructor();
			this.dataProcessor = null;
		}
	}

	shouldComponentUpdate(nextProps) {
		return this.props.zoom !== nextProps.zoom;
	}

	componentDidUpdate() {
		gantt.render();
	}
	
}