<template>
<div class="content" id="content">
				<div class="container">
					<div class="aplication-container" id="app1" >
						<div class="application-line" id="app-name">
							<h1>{{game.name}}</h1>
						</div>
	
						<div class="application-line" id="app-content" style="clear: both;">
								<div class="application-column">
										<div class="app-icon">
											<img v-bind:src="game.icon" style="width:80%; border-radius: 20%;">	
										</div>
										<div class="market-link">											
											<template v-if="game.gpUrl && game.gpUrl != ''">
												<a target="_blank" rel="noopener noreferrer" v-bind:href="game.gpUrl">
													<img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' style="width:80%"/>
												</a>
											</template>
											<template v-else>
												<img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' style="width:80%;  filter: blur(3px);"/>												
											</template>											
										</div>	
										<div class="market-link">											
											<template v-if="game.appStoreUrl && game.appStoreUrl != ''">
												<a target="_blank" rel="noopener noreferrer" v-bind:href="game.appStoreUrl">
													<img alt='Get it on AppStore' src='src/assets/app-store-badge.png' style="width:80%;"/>
												</a>
											</template>
											<template v-else>
												<img alt='Get it on AppStore' src='src/assets/app-store-badge.png' style="width:80%; filter: blur(3px);"/>
											</template>
										</div>	
									</div>
									<div class="application-bigcolumn">		
										<div class="video_container">
											<template v-if="game.video && game.video != ''">
												<iframe class="video" v-bind:src="game.video" frameborder="0" 
											allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
											</template>
											<template v-if="game.featcher && game.featcher != ''">
												<img v-bind:src="game.featcher" style="width:100%"/>
											</template>
											
										</div>
									</div>				
						</div>
						<div class="application-line" id="app-content" style="clear: both;">
						</div>
						<div class="application-line" id="app-content" style="clear: both;">
							
							<div class="application-column">
									<img data-enlargable v-bind:src="game.screen1" alt="Monterosso" style="width:100%;cursor: zoom-in" class="img-enlargable">			
								</div>
								<div class="application-column">
									<img data-enlargable v-bind:src="game.screen2" alt="Monterosso" style="width:100%;cursor: zoom-in" class="img-enlargable">
								</div>
								<div class="application-column">
									<img data-enlargable v-bind:src="game.screen3" alt="Monterosso" style="width:100%;cursor: zoom-in" class="img-enlargable">
								</div>
							<div class="application-column" >
								<div id="app-name">
									<h2>Description</h2>
								</div>
								<h2>{{game.description}}</h2>
								
							</div>										
						</div>
					</div>
				</div>	
			</div>
</template>

<script>
export default {
    props: {
        'game': Object
        }
}
</script>