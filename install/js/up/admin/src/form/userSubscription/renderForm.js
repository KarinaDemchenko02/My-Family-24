import {Tag} from 'main.core';

export class RenderForm
{
	static render(data)
	{
		return Tag.render`
		<div class="sign-up-modal">
			<div class="logo-container">
				<svg height="90px" width="90px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
				viewBox="0 0 512 512"  xml:space="preserve">
					<style type="text/css">
					.st0{fill:#fff;}
					</style>
					<g>
						<path class="st0" d="M465.771,234.587c0-26.914-10.749-51.289-28.142-69.166c0.629-4.688,1.075-9.437,1.075-14.301
						c0-54.151-40.625-98.726-93.05-105.14C319.308,17.754,281.874,0,240.206,0C160.476,0,95.853,64.624,95.853,144.361
						c0,0.422,0.062,0.821,0.062,1.236c-29.975,20.27-49.686,54.58-49.686,93.494c0,53.346,37.08,97.937,86.842,109.667
						c10.089,24.69,34.318,42.106,62.636,42.106c10.557,0,20.508-2.486,29.407-6.798V512h77.528v-83.988l30.236-51.657
						c30.95-2.256,57.097-21.766,68.743-49.033C439.087,313.128,465.771,277.022,465.771,234.587z M260.615,342.229
						c0.66,0.928,1.343,1.826,2.041,2.724l-3.43,1.396C259.725,344.984,260.208,343.625,260.615,342.229z M284.874,405.402v-40.579
						c7.181,4.366,15.076,7.642,23.492,9.622L284.874,405.402z"/>
					</g>
				</svg>
			</div>
			<form class="details">
				<div class="input-container">
					<label class="modal-form-label" for="subId">${BX.message('UP_TREE_ADMIN_SUBSCRIPTION_ID')}:</label>
					<input class="col-sm-12 with-placeholder" value="${data.subscriptionId}" id="subId" type="number" placeholder="ID" min="0"/>
				</div>
				<div class="input-container">
					<label class="modal-form-label" for="countTrees">${BX.message('UP_TREE_ADMIN_NUMBER_TREES')}:</label>
					<input class="col-sm-12 with-placeholder" value="${data.countTrees}" id="countTrees" type="number" min="0"/>
				</div>
				
				<div class="input-container">
					<label class="modal-form-label" for="countNodes">${BX.message('UP_TREE_ADMIN_NUMBER_NODES')}:</label>
					<input class="col-sm-12 with-placeholder" value="${data.countNodes}" id="countNodes" type="number" placeholder="0" min="0"/>
				</div>
				
				<div class="input-container">
					<label class="modal-form-label" for="buyTime">${BX.message('UP_TREE_ADMIN_BUY_TIME')}:</label>
					<input class="col-sm-12 with-placeholder" value="${data.buyTime}" id="buyTime" type="datetime-local" step="2" placeholder="buyTime" />
				</div>
			
			
				<input id="edit-button" type="submit" value="Edit">
			</form>
		</div>
		`;
	}
}