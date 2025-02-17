import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { OAuth } from 'meteor/oauth';
import type { ServerMethods } from '@rocket.chat/ui-contexts';

Accounts.registerLoginHandler('iframe', function (result) {
	if (!result.iframe) {
		return;
	}

	check(result.token, String);

	const user = Meteor.users.findOne({
		'services.iframe.token': result.token,
	});

	if (user) {
		return {
			userId: user._id,
		};
	}
});

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		'OAuth.retrieveCredential'(credentialToken: string, credentialSecret: string): unknown;
	}
}

Meteor.methods<ServerMethods>({
	'OAuth.retrieveCredential'(credentialToken, credentialSecret) {
		return OAuth.retrieveCredential(credentialToken, credentialSecret);
	},
});
