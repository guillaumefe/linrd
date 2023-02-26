import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { selectTasks } from '../helpers/Reducer';

export const Dlxls = () => {
  const tasks = useSelector(selectTasks);

  const create = () => {
    const regex = /^(\s*)- \[( |x)\](.*)$/gm;

    // On utilise un objet pour stocker les actions terminées et totales pour chaque contexte
    const contextData = {};

    // On parcourt chaque tâche pour extraire les actions et les ajouter à contextData
    tasks.forEach((task) => {
      const matches = [...task.value.matchAll(regex)];
      if (matches.length === 0) return;

      const contextName = task.path
        .join(", ")
        .replace(/[>:|]$/g, "")
        .replace(/^\w/, (c) => c.toUpperCase());

      // On utilise un tableau pour stocker toutes les actions pour ce contexte
      const contextActions = [];

      matches.forEach((match) => {
        const isComplete = match[2] === "x";
        let formattedTaskName = match[3]
		
		// Si le nom de la tâche se termine par "+-", on ignore cette action
        if (formattedTaskName.trim().endsWith("+-")) {
          return;
        }
		
		formattedTaskName = formattedTaskName
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase())
          .replace(/[^.?!]\s*$/, "$&.")
          .replace(/\n\s*/g, "\n");

        // On ajoute l'action à contextActions avec son état de complétion
        contextActions.push({ name: formattedTaskName, isComplete });
      });

      // On ajoute les données pour ce contexte à contextData
      contextData[contextName] = {
        actions: contextActions,
        completed: contextActions.filter((action) => action.isComplete).length,
        total: contextActions.length,
      };
    });

    // On crée un tableau de données à partir de contextData pour l'exportation
    const data = [
      ["Context", "Context completion", "Action", "Action completion", "Done"],
      ...Object.entries(contextData).flatMap(([contextName, context]) => {
        // Fusionne les cellules contenant le même contexte
        let rowspan = context.actions.length;
        return context.actions.map(({ name, isComplete }, index) => [
          // Centre et aligne à gauche les cellules
          {v: contextName, s:{ alignment: { vertical: "center", horizontal: "left" }},
          r: `${index === 0 ? 0 : 1}${index}:${rowspan + index - 1}${index}`},
          `${Math.round(
            (context.completed / context.total) * 100
          )}%`, // Taux de complétion pour le contexte
          name,
          isComplete ? "100%" : "0%",
          isComplete ? "TRUE" : "FALSE",
        ]);
      }),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Actions");
    XLSX.writeFile(wb, "Export.xlsx");
  };

  return <button onClick={create}>Export</button>;
};
