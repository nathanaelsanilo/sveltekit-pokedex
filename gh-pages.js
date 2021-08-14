const ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/nathanaelsanilo/sveltekit-pokedex.git', // Update to point to your repository
		user: {
			name: 'Nathanael', // update to use your name
			email: 'nathanaelsanilo@gmail.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);