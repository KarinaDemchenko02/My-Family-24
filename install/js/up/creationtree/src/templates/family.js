export class Family
{
	static create(list, templateName)
	{
		let family =  new FamilyTree(document.getElementById('tree'), {
			mouseScrool: FamilyTree.action.scroll,
			searchDisplayField: 'name',
			searchFields: ["name", "surname"],
			searchFieldsWeight: {
				"name": 100,
			},
			template: templateName,
			nodeTreeMenu: true,
			nodeMenu: {
				remove: {text: 'Remove'},
			},
			nodes: list,
			nodeBinding: {
				field_0: 'name',
				field_1: "surname",
				img_0: 'photo'
			},
			exportUrl: 'http://127.0.0.1:1337',
			editForm: {
				titleBinding: "name",
				photoBinding: "photo",
				addMore: null,
				cancelBtn: 'Close',
				saveAndCloseBtn: 'Save',
				generateElementsFromFields: false,
				buttons: {
					share: null,
					remove: null,
				},
				elements: [
					{type: 'textbox', label: 'Name', binding: 'name'},
					{type: 'textbox', label: 'Surname', binding: 'surname'},
					[
						{type: 'date', label: 'Date Of Birth', binding: 'birthDate'},
						{type: 'date', label: 'Date Of Death', binding: 'deathDate'}
					],
					[
						{type: 'textbox', label: 'Weight', binding: 'weight'},
						{type: 'textbox', label: 'Height', binding: 'height'}
					],
					[
						{
							type: 'select',
							options: [{value: 'male', text: 'Male'}, {value: 'female', text: 'Female'}],
							label: 'Gender',
							binding: 'gender'
						},
					],
					[
						{
							type: 'select',
							options: [
								{value: 'without education', text: 'Without education'},
								{value: 'school', text: 'School'},
								{value: 'secondary', text: 'Secondary'},
								{value: 'higher', text: 'Higher'},
							],
							label: 'Education Level',
							binding: 'education'
						},
					],
					{ type: 'checkbox', label: 'Important', binding: 'active' }
				]
			},
		});

		return family;
	}
}