import {Type, Tag} from 'main.core';
import {Requests} from "./requests.js";
import {Helper} from "./helper.js";
import {DownloadJson} from "./downloadJson.js";
import {CreatedNode} from "./createdNode";
import {Family} from "./templates/family.js";
import {Original} from "./templates/original.js";
import {Sriniz} from "./templates/sriniz.js";
import {Multiple} from "./templates/multiple.js";
import {John} from "./templates/john.js";

export class CreationTree
{
	constructor(options = {})
	{
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('Tree: options.rootNodeId required');
		}

		this.rootNode = BX(this.rootNodeId);

		if (!this.rootNode)
		{
			throw new Error(`Tree: element with id "${this.rootNodeId}" not found`);
		}

		this.nodeList = [];

		this.isHandlerAdded = false

		const buttonJSON = BX('json');
		BX.bind(buttonJSON, 'click', () => {
			this.nodeList.persons.forEach(person => {
				DownloadJson.changeKey(person, 'mid', 'mother');
				DownloadJson.changeKey(person, 'fid', 'farther');
				DownloadJson.changeKey(person, 'pids', 'partners');
			})
			DownloadJson.download(this.nodeList.persons, "familyTree")
		});

		setTimeout(() => {
			this.reload();
		}, 300)

	}

	reload()
	{
		const id = parseInt(window.location.href.match(/\d+/));
		Requests.loadNodes(id).then(nodeList => {
			this.nodeList = nodeList;

			this.nodeList.persons.forEach(person => {
				person.birthDate = new Date(person.birthDate);

				person.active = person.active !== '0';

				let newStyles = document.createElement('style')
				document.head.append(newStyles);

				if (person.active) {
					newStyles.innerHTML = `svg.hugo [data-n-id="${person.id}"].node>rect {
							fill: #FFE13E
						}`
				}
				else {
					newStyles.innerHTML = `svg.hugo [data-n-id="${person.id}"].node>rect {
							fill: url(#hugo_grad_${person.gender})
						}`
				}
			})

			this.render();
		});
	}

	tree(nameTemplate)
	{
		localStorage.setItem('template', nameTemplate);

		let family = Family.create(this.nodeList.persons, nameTemplate);

		if (nameTemplate === 'hugo') {
			Original.stylingNode(family);
		}
		else if (nameTemplate === 'sriniz') {
			Sriniz.stylingNode(family);
		}
		else if (nameTemplate === 'main')
		{
			Multiple.stylingNode(family);
		}
		else if (nameTemplate === 'john')
		{
			John.stylingNode(family);
		}

		let treeID =  parseInt(window.location.href.match(/\d+/));
		const self = this;
		const buttonPDF = BX('pdf');
		BX.bind(buttonPDF, 'click', () => {
			family.exportPDF();
		});

		family.onUpdateNode((args) =>
		{
			const updateNodes = args.updateNodesData;
			const addNodes = args.addNodesData;
			const removeNodes = args.removeNodeId;

			if (Object.keys(addNodes).length !== 0 &&  Object.keys(updateNodes).length !== 0 && removeNodes === null && !addNodes[0].pids) {

				if (updateNodes[0].mid)
				{
					addNodes[0].child = {mid: Number(updateNodes[0].id)};
				}
				else if(updateNodes[0].fid)
				{
					addNodes[0].child = {fid: Number(updateNodes[0].id)};
				}
			}

			if (Object.keys(updateNodes).length === 2 && addNodes[0].pids) {
				updateNodes.forEach(node => {

					if (node.fid && node.fid === addNodes[0].id)
					{
						addNodes[0].child = {fid: updateNodes[0].id};

					} else if (node.mid && node.mid === addNodes[0].id)
					{
						addNodes[0].child = {mid: updateNodes[0].id};
					}

				})
			}
		});

		family.nodeMenuUI.on('show', function(sender, args){
			args.menu = {
				edit: {
					text: 'Edit',
				},
				remove: {
					text: 'Remove',
					onClick: function onClick() {
						if (confirm("Are you sure you are going to remove this family member?")) {
							Requests.removeNode(args.firstNodeId).then(node => {
								self.reload();
							});
						}
					},
				},
				details: {
					text: "Details"
				},
			}
		});

		let onUpdateNodeAdded = false;
		let onUpdatePerson = false;

		family.on('click', function(sender, args){

			if (args.node.id && typeof args.node.id === "string" && !onUpdateNodeAdded)
			{
				onUpdateNodeAdded = true;
				family.onUpdateNode((args) =>
				{
					const updateNodes = args.updateNodesData;
					const addNodes = args.addNodesData;
					const removeNodes = args.removeNodeId;

					const formData = new FormData();
					const fileInput = form.querySelector('input[type="file"]');
					formData.append(fileInput.name, fileInput.files[0]);

					if (BX('photoName').value !== '')
					{
						fetch(
							`/tree/${treeID}/`,
							{
								method: 'POST',
								headers: {
									"X-Bitrix-Csrf-Token": BX.bitrix_sessid()
								},
								body: formData
							}
						)
							.then((response) => {
								if (!response.ok) {
									throw new Error('Network response was not ok');
								}
								return response.json();
							})
							.then((response) => {
								updateNodes[0].imageId = response.data.fileId;

								CreatedNode.addNode(updateNodes, addNodes, removeNodes, self);
							})
							.catch((error) => {
								console.error('Error while changing item:', error);
							});
					}
					else
					{
						updateNodes[0].imageId = 1;
						CreatedNode.addNode(updateNodes, addNodes, removeNodes, self);
					}

				});
			}
			else if(!onUpdatePerson)
			{
				onUpdatePerson = true;

				family.onUpdateNode(async (args) => {

					if (Object.keys(args.addNodesData).length !== 0) {
						return;
					}

					const formData = new FormData();
					const fileInput = form.querySelector('input[type="file"]');
					formData.append(fileInput.name, fileInput.files[0]);

					const updateNodes = args.updateNodesData;

					const id = updateNodes[0].id;
					const gender = updateNodes[0].gender[0];
					const name = updateNodes[0].name;
					const imageId = updateNodes[0].imageId;
					const surname = updateNodes[0].surname;
					let active = updateNodes[0].active;
					let birthDate = Helper.formatDate(updateNodes[0].birthDate);
					let deathDate = Helper.formatDate(updateNodes[0].deathDate);

					if (active) {
						active = '1'
					} else {
						active = '0'
					}

					if (updateNodes[0].deathDate.length === 0) {
						deathDate = null;
					}

					if (updateNodes[0].birthDate.length === 0) {
						birthDate = null;
					}

					if (BX('photoName').value !== '')
					{
						fetch(
							`/tree/${treeID}/`,
							{
								method: 'POST',
								headers: {
									"X-Bitrix-Csrf-Token": BX.bitrix_sessid()
								},
								body: formData
							}
						)
							.then((response) => {
								if (!response.ok) {
									throw new Error('Network response was not ok');
								}
								return response.json();
							})
							.then((response) => {
								const lastImageId = updateNodes[0].imageId;
								updateNodes[0].imageId = response.data.fileId;
								const imageId = updateNodes[0].imageId;

								Requests.updateNode(id, active, imageId, lastImageId, name, surname, birthDate, deathDate, gender, treeID).then(node => {
									self.reload();
									return node;
								})
							})
							.catch((error) => {
								console.error('Error while changing item:', error);
							});
					}
					else
					{
						Requests.updateNode(id, active, imageId, 0, name, surname, birthDate, deathDate, gender, treeID).then(node => {
							self.reload();
							return node;
						})
					}
				})
			}

			sender.editUI.show(args.node.id, false);

			const form = document.querySelector('.bft-edit-form');
			const editForm = document.querySelector('.bft-form-fieldset');

			form.enctype = "multipart/form-data";
			form.action = '/tree/{id}/';
			const formFile = Tag.render`
				<label class="input-file">
					<span class="input-file-text" type="text"></span>
					<input id="photoName" type="file" name="photo">
					<span class="input-file-btn">Выберите файл</span>
				</label>
			`;

			editForm.append(formFile);

			BX('photoName').addEventListener('change', function(){
					let file = this.files[0];
					document.querySelector('.input-file-text').innerHTML = file.name;
				}
			);

			return false;
		})
	}

	render()
	{
		Helper.addRelation(this.nodeList);

		if (localStorage.getItem('template')) {
			this.tree(localStorage.getItem('template'));
		} else {
			this.tree('hugo');
		}

		BX('tree').style.backgroundColor = localStorage.getItem('mode') ? localStorage.getItem('mode') : '#F1F9F8';

		if (localStorage.getItem('mode')) {
			if (localStorage.getItem('mode') === '#000000') {
				BX('color_mode').checked = true;
			}
		}

		BX('navbar-purchases').innerHTML = localStorage.getItem('titleTemplate') ? localStorage.getItem('titleTemplate') : 'Skins';

		if (!this.isHandlerAdded) {
			BX.bind(BX('Sriniz'), 'click', () => {
				this.tree('sriniz');
				localStorage.setItem('titleTemplate', 'Sriniz');
				this.reload();
			})

			BX.bind(BX('color_mode'), 'click', () => {
				const template = localStorage.getItem('template') ? localStorage.getItem('template'): 'hugo';
				if (BX('color_mode').checked)
				{
					localStorage.setItem('mode', '#000000');
					this.tree(template);
					this.reload();
				}
				else {
					localStorage.setItem('mode', '#F1F9F8');
					this.tree(template);
					this.reload();
				}
			})

			BX.bind(BX('Hugo'), 'click', () => {
				this.tree('hugo');
				localStorage.setItem('titleTemplate', 'Hugo');
				this.reload();
			})

			BX.bind(BX('Multiple'), 'click', () => {
				this.tree('main');
				localStorage.setItem('titleTemplate', 'Multiple');
				this.reload();
			})

			BX.bind(BX('Royal'), 'click', () => {
				this.tree('john');
				localStorage.setItem('titleTemplate', 'Royal');
				this.reload();
			})

			BX.bind(BX('logout'), 'click', () => {
				localStorage.clear();
			});

			this.isHandlerAdded = true;
		}
	}
}