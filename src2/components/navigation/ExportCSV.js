import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectTasks,
} from '../helpers/Reducer';

export const Dlxls = () => {

      const _tasks = useSelector(selectTasks)
      const tasks = [..._tasks] 


	const create = () => {

		const headers = ['Context', 'Task', 'Load', 'Ressources', 'Comments']

		let data = tasks.map((t) => {

			let statut = ''

			if (t.await) {
				statut = "in a waiting state"
			} 
			if (t.cancel) {
				statut = "has been canceled"
			} 
			if (t.done) {
				statut = "is done"
			} 
			if (t.delay) {
				statut = "to do"
			} 
			if (t.doc) {
				statut = "documentation"
			}

			return [
				    (t.path.length) ? "(" + t.path.join(', ') + ")" : '',
				    t.value.trim().replace(/[*&+x-]-$/, ''),
				    (t.duration > 200) ? 'very high' : (t.duration > 90) ? 'high' : (t.duration > 59) ? 'medium' : (t.duration >= 30) ? 'low' : (t.duration >= 0) ? 'very low':'',
				    t.person,
				    statut
			];
		})

		//data = [  ["Nom", "Pr�nom", "�ge"],
		//	  ["Dupont", "Jean", 30],
		//	  ["Durand", "Marie", 25]
		//];

		data.unshift(headers)
		// Create a workbook object
		const wb = { SheetNames: ['Actions'], Sheets: { Sheet1: {} } };

		// Add the data to the worksheet
		//const ws = XLSX.utils.aoa_to_sheet(data);
		//const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
		const ws = XLSX.utils.aoa_to_sheet(data);

		// Add the worksheet to the workbook
		wb.Sheets['Actions'] = ws;

		const today = new Date();

		const options = {
			  month: 'long',
			  day: 'numeric',
			  year: 'numeric'
		};

		const dateString = today.toLocaleDateString('en-US', options);

		// Write the workbook to an XLSX file
		XLSX.writeFile(wb, dateString +'.xlsx');
	}

	return (
		<button onClick={(e) => create()}>Export</button>
	)
}
