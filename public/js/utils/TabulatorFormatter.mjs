export const TabulatorFormatter = {

  red: (cell, formatterParams, onRendered) => {

    cell.getElement().style.backgroundColor = 'red'
  },

  colour: (cell, formatterParams, onRendered) => {

    cell.getElement().style.backgroundColor = formatterParams.colour;
  }

}