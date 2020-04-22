const $tpl = document.getElementById("panel-item");
const $panel_list = document.querySelector(".panel-section-list");

$panel_list.addEventListener("click", function(e){
	let el = e.target;
	while( !el.classList.contains("panel-list-item") ){
		el = el.parentNode;
	}

	browser.ProfileManager.open( el.dataset.name ).then( () => { window.close(); });
}, true)

function getProfiles(){
	return browser.ProfileManager.getAll();
}

function renderProfiles( profilesList ){
	for( let profile of profilesList ){
		let tpl_item = $tpl.content.childNodes[0].cloneNode(true);
		let tpl_name = tpl_item.querySelector(".text");
		let tpl_text = tpl_item.querySelector(".text-shortcut");

		tpl_name.textContent = profile.name;
		tpl_text.textContent = (profile.inUse ? "Current" : "");

		tpl_item.dataset.name = profile.name;
		$panel_list.append( tpl_item );
	}
}

getProfiles().then( renderProfiles );