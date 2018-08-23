import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash.pick';
import moment from 'moment/moment';
import { DATE_FORMAT, KEYBOARD_KEY_VALUES } from '../../constants';
import TextField from '../TextField';
import DatePicker, { DateLabelsPropType } from './DatePicker';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/fontawesome-free-solid';
import './DateField.css';

const DATE_PICKER_HEIGHT = 362; //pixels
const HEADER_HEIGHT = 72; //pixels
const PAGE_TOP_OFFSET = DATE_PICKER_HEIGHT + HEADER_HEIGHT; // pixels
const SECOND = 1000; // milliseconds.

class DateField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValue: '',
            value: parseInt(props.defaultValue, 10),
            hasFocus: false,
            datePickerPosition: 'top'
        };
    }

    getState() {
        return { ...this.state, ...pick(this.props, ['value']) };
    }

    getFormattedDate() {
        const { value } = this.getState();

        if (!value || isNaN(value)) {
            return '';
        }

        const date = new Date(value * SECOND);
        return moment(date).format(DATE_FORMAT);
    }

    handleFocus() {
        const { value } = this.getState();
        const dateFieldBounds = this.dateFieldRef.getBoundingClientRect();
        const datePickerPosition = dateFieldBounds.top >= PAGE_TOP_OFFSET ? 'top' : 'bottom';

        this.setState({
            initialValue: value,
            hasFocus: true,
            datePickerPosition
        });
    }

    handleKeyDown(event) {
        if (event.key === KEYBOARD_KEY_VALUES.BACKSPACE || event.key === KEYBOARD_KEY_VALUES.DELETE) {
            const { onChange, name } = this.props;
            const value = '';

            this.setState({ hasFocus: false, value });
            onChange && onChange({ name, value });
        }
    }

    handleChange(date) {
        const { onChange, name } = this.props;
        const value = parseInt(date.getTime() / SECOND, 10);

        this.setState({ value });
        onChange && onChange({ name, value });
    }

    handleOnCancel() {
        const { initialValue } = this.getState();
        const { onChange, name } = this.props;

        this.setState({ hasFocus: false, value: initialValue });
        onChange && onChange({ name, value: initialValue });
    }

    handleConfirm(date) {
        this.setState({ hasFocus: false });
        this.handleChange(date);
    }

    handleDatePickerClickOutside(event) {
        const { hasFocus } = this.state;

        if (hasFocus && !this.dateFieldRef.contains(event.target)) {
            this.setState({ hasFocus: false });
        }
    }

    renderDatePicker() {
        const { datePickerLabels } = this.props;
        const { value, hasFocus, datePickerPosition } = this.getState();
        const classes = classNames('date-field-datepicker', `date-field-datepicker--${datePickerPosition}`);

        if (hasFocus) {
            return (
                <DatePicker
                    className={classes}
                    position={datePickerPosition}
                    labels={datePickerLabels}
                    date={!value || isNaN(value) ? new Date() : new Date(value * SECOND)}
                    onChange={date => this.handleChange(date)}
                    onCancel={() => this.handleOnCancel()}
                    onConfirm={date => this.handleConfirm(date)}
                    onClickOutside={event => this.handleDatePickerClickOutside(event)}
                />
            );
        }

        return null;
    }

    render() {
        const { label, error, disabled } = this.props;
        const { hasFocus } = this.state;
        const addon = (
            <span className="date-field-addon">
                <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
        );
        const classes = classNames('date-field', disabled && 'date-field--disabled');

        return (
            <div className={classes} ref={ref => (this.dateFieldRef = ref)}>
                <TextField
                    disabled={disabled}
                    label={label}
                    addon={addon}
                    value={this.getFormattedDate()}
                    error={error}
                    hasFocus={hasFocus}
                    onFocus={event => this.handleFocus(event)}
                    onKeyDown={event => this.handleKeyDown(event)}
                />
                {this.renderDatePicker()}
            </div>
        );
    }
}

DateField.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    datePickerLabels: DateLabelsPropType,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};
DateField.defaultProps = {
    datePickerLabels: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

export default DateField;
