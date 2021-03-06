/*
 * Title: InputView
 * Author: MinterLee@hotmail.com
 * CreateDate: 2016-09-19
 * Description: ...
 */

import {Component } from 'react';
import PropTypes from 'prop-types';
import styles from './TodoInput.css';
import classNames from 'classnames';
import CSSModules from 'react-css-modules';
import Immutable from 'immutable';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';


// 加入CSSModules高阶组件，方便使用styles。注意css文件中class
// 的名称不是最后的名称（webpack中由CSSMoudels重新命名了）
// 所以这里使用styleName调用
@immutableRenderDecorator
@CSSModules(styles, {allowMultiple: true})
export default class TodoInputView extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    static propTypes = {
        addTodo: PropTypes.func.isRequired
    }

    state = {
        data: Immutable.fromJS({
            inputValue : '',
            showError: false,
            errorMsg : '请输入正确的Todo!'
        })
    }

    render(){
        const immData = this.state.data;
        // 直接放入结构中判断，会造成此dom在diff时总是与原来不等，
        // 因为每次都是计算出来的，结果相同，内存指向也不同，所以提前计算好
        const errorMsgClass = classNames({'error': true, 'displayBlock': immData.get('showError')});
        return <div>
            <input 
                type = 'text'
                autoFocus = {true}
                value = {immData.get('inputValue')}
                styleName = { 'inputOption' }
                placeholder = 'Please input todos'
                onChange = { this.handleChange }
                onKeyDown = { this.handleSave }/>
            <div styleName = {errorMsgClass} > { immData.get('errorMsg') }</div>
        </div>
    }

    handleChange(e) {
        const inputValue = e.target.value;
        this.setState(({data}) => ({
            data: data.set('inputValue', inputValue)
        }));
    }

    handleSave(e) {
        const inputValue = e.target.value.trim();
        if (e.which === 13) {
            if (inputValue.length === 0) {
                this.setState(({data}) => ({
                    data: data.set('showError', true)
                }));
            }else{
                this.props.addTodo(inputValue);
                this.setState(({data}) => ({
                    data : data
                        .set('inputValue', '')
                        .set('showError', false)
                }))
            }
        }
    }

}