import * as React from 'react';
import {Header, Image} from 'semantic-ui-react';

/**
 * Component containing the second section of the user manual.
 */
class Section2 extends React.Component<any, any> {

    const;
    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    /** Render component **/
    render() {
        const s21 = require('../../img/user_manual/s2_1.png');
        const s22 = require('../../img/user_manual/s2_2.png');
        const s23 = require('../../img/user_manual/s2_3.png');
        const s24 = require('../../img/user_manual/s2_4.png');
        const s25 = require('../../img/user_manual/s2_5.png');
        const s26 = require('../../img/user_manual/s2_6.png');
        const s27 = require('../../img/user_manual/s2_7.png');
        const s28 = require('../../img/user_manual/s2_8.png');
        const s29 = require('../../img/user_manual/s2_9.png');
        return (
            <div style={{marginTop: '2em'}} id="2">
                <Header as="h1"> Getting Started </Header>
                <p> To be able to use the UnSHACLed editor, you must create an account at first. The following sections
                    will aide the end user in setting up such an account, signing in with the account and signing out
                    from the editor.
                </p>

                {/** Create an account **/}

                <Header as='h2' color="teal" id="2.1"> Create an account </Header>
                <p>
                    The first step in joining UnSHACLed is creating an account to authenticate. This account enables
                    the end user to remotely store or fetch files and work collaboratively with others. To create an
                    account on arrival on our home page, click the sign-up button as indicated in the figure below.
                    The following will guide you through the process of <b> creating an account </b>.
                </p>
                <Image src={s22} centered={true} style={this.imgMargin} size="big"/>
                <p>
                    After doing so, you will arrive at the sign-up page as illustrated below:
                </p>
                <Image src={s23} centered={true} style={this.imgMargin} size="big"/>
                <p>
                    The sign-up is designed to assist the user in creating an account as much as possible. UnSHACLed
                    accounts are powered by GitHub, as we use git for all our remote interactions through our server.
                    All instructions are at the sign-up page itself, but will be repeated here once more. To create an
                    account, click the 'Sign up for GitHub' button below. This will bring you to the sign-up page of
                    GitHub which should look like the following:
                </p>
                <Image src={s24} centered={true} style={this.imgMargin} size="big"/>
                <p>
                    The next step in creating an account is picking a username, an email and a password. As you can see
                    in the figure above, GitHub requires some rules on each of these elements. First of all you need
                    to pick a username that is still available on GitHub. Next, a valid e-mail address should be
                    specified as this will be needed to validate your account afterwards. Finally the password you
                    choose, should contain at least one lowercase letter, one numeral and at least seven characters.
                    After picking three valid fields to create your account, press the 'Create an account' button
                    at the bottom of the page. From here on you will need to complete two more steps to create your
                    account. These steps are rather trivial as they include only filling in some user informationn
                </p>
                <p>
                    After successfully setting up your account, you can go to the login page, to authenticate yourself
                    with UnSHACLed. To do so follow the links in the text (first paragraph or Step 4) to the login page.
                    For more information on how to login, see the 'Login to UnSHACLed' section.
                </p>

                {/** Login to UnSHACLed **/}

                <Header as='h2' color="teal" id="2.2"> Login to UnSHACLed </Header>
                <p> The following will guide you through the process of <b> creating an account </b>.</p>
                <p> After you successfully set up an account to login, you can navigate to the login-page by clicking
                    the 'Login' button on our home page as indicated in the figure below. If you do not have an account
                    yet, please consult the section on how to 'Create an account' first.
                </p>
                <Image src={s21} centered={true} style={this.imgMargin} size="big"/>
                <p>
                    Next you will arrive at the login page which should like the following:
                </p>
                <Image src={s25} centered={true} style={this.imgMargin}/>
                <p>
                    To be able to log into our UnSHACLed editor, you have to authenticate yourself first. The first
                    step in doing so, is clicking the 'Sign in' button. This will open a pop-up window where you
                    are able to login with your account credentials. An example of how such a pop-up should like
                    is given below. If you do not have an account, you can click the 'Sign-up' button. This will
                    navigate you to the sign-up page allowing you set up an account as described in the 'Create an
                    account' section.
                </p>
                <Image src={s27} centered={true} style={this.imgMargin}/>
                <p>
                    Next, login with your account credentials through GitHub as illustrated in the figure above.
                    When you are ready, click the 'Sign in' button to authenticate. If your credentials were correct,
                    you will see a confirmation message, indicating you successfully authenticated to our server. This
                    message could va ry, but should look like the following:
                </p>
                <Image src={s28} centered={true} style={this.imgMargin}/>
                <p>
                    After successfully completing the authentication, you can close the pop-up window and return
                    to the UnSHACLed editor. To start editing, you simply click the 'Start editing button'. If
                    you are authenticated, this action will navigate you to the workspace where you are all set to go.
                    If not, the authentication failed and following error message should be displayed:
                </p>
                <Image src={s26} centered={true} style={this.imgMargin}/>
                <p>
                    If you see this message, please try to authenticate again.
                </p>

                {/** Logout from UnSHACLed **/}
                <Header as='h2' color="teal" id="2.3"> Logout </Header>
                <p> The following will guide you through the process of <b> logging out from the editor </b>.</p>
                <p>
                    If you are done editing, or want to switch to a different account you can log out from the
                    editor. To logout, click the user info drop down in the right corner of the top toolbar. This
                    will bring up the following:
                </p>
                <Image src={s29} centered={true} style={this.imgMargin} size="small"/>
                <p>
                    To logout, you simply click the 'Sign out' option. This will navigate you back to the login page
                    after which you are successfully logged out. If you want to login with another account, please
                    read the section on how to 'Login to UnSHACLed'.
                </p>
            </div>
        );
    }
}

export default Section2;
