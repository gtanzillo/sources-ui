import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Pagination, Section } from '@red-hat-insights/insights-frontend-components';

//import './provider-page.scss';
import { addProvider, createSource, filterProviders, loadEntities, loadSourceTypes } from '../redux/actions/providers';

import { Button } from '@patternfly/react-core';
import { Card, CardBody, CardFooter, Modal } from '@patternfly/react-core';

import SourcesSimpleView from '../components/SourcesSimpleView';
//import SourcesFilter from '../components/SourcesFilter';
import SourcesEmptyState from '../components/SourcesEmptyState';

import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { wizardForm } from '../SmartComponents/ProviderPage/providerForm';
import SourcesFormRenderer from '../Utilities/SourcesFormRenderer';

import { pageAndSize } from '../redux/actions/providers';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SourcesPage extends Component {
    static propTypes = {
        addProvider: PropTypes.func.isRequired,
        createSource: PropTypes.func.isRequired,
        filterProviders: PropTypes.func.isRequired,
        loadEntities: PropTypes.func.isRequired,
        loadSourceTypes: PropTypes.func.isRequired,
        pageAndSize: PropTypes.func.isRequired,

        numberOfEntities: PropTypes.number.isRequired,
        sourceTypes: PropTypes.arrayOf(PropTypes.any),
        loaded: PropTypes.bool.isRequired,

        location: PropTypes.any.isRequired,
        history: PropTypes.any.isRequired
    };

    componentDidMount = () => {
        this.props.loadSourceTypes();
        this.props.loadEntities();
    }

    constructor (props) {
        super(props);

        this.state = {
            itemsPerPage: 10,
            onPage: 1
        };
    }

    submitProvider = (values, _formState) => {
        this.props.createSource(values, this.props.sourceTypes).then(() => {
            this.props.history.replace('/');
            this.props.loadEntities();
        }).catch(error => {
            console.log('CATCH:'); console.log(error);
            this.props.history.replace('/');
        });
    }

    onFilter = (filterColumn, filterValue) => {
        console.log('onFilter', filterColumn, filterValue);
        this.props.filterProviders(filterColumn, filterValue);
    }

    onSetPage = (number) => {
        this.setState({
            onPage: number
        });
        this.props.pageAndSize(number, this.state.itemsPerPage);
    }

    onPerPageSelect = (count) => {
        this.setState({
            onPage: 1,
            itemsPerPage: count
        });
        this.props.pageAndSize(1, count);
    }

    renderMainContent = () => (
        <Card>
            {/*<CardHeader>
                <SourcesFilter columns={filterColumns} onFilter={this.onFilter}/>
            </CardHeader>*/}
            <CardBody>
                <SourcesSimpleView columns={sourcesViewDefinition.columns}/>
            </CardBody>
            <CardFooter>
                <Pagination
                    itemsPerPage={this.state.itemsPerPage}
                    page={this.state.onPage}
                    direction='up'
                    onSetPage={this.onSetPage}
                    onPerPageSelect={this.onPerPageSelect}
                    numberOfItems={this.props.numberOfEntities || 0}
                />
            </CardFooter>
        </Card>
    )

    render = () => {
        // const filterColumns = filter(providerColumns, c => c.value);
        const { numberOfEntities } = this.props;
        const form = wizardForm(this.props.sourceTypes || []);
        const displayEmptyState = this.props.loaded && (!numberOfEntities || numberOfEntities === 0);

        return (
            <React.Fragment>
                <Modal
                    title='Add a New Source'
                    isOpen={this.props.location.pathname === '/new'}
                    onClose={this.props.history.goBack}
                    isLarge>

                    <SourcesFormRenderer
                        initialValues={form.initialValues}
                        schemaType={form.schemaType}
                        schema={form.schema}
                        uiSchema={form.uiSchema}
                        showFormControls={form.showFormControls}
                        onSubmit={this.submitProvider}
                    />
                </Modal>
                <PageHeader>
                    <PageHeaderTitle title='Sources'/>
                    <Link to='/new'>
                        <Button className='pull-right' variant='secondary'> Add a New Source </Button>
                    </Link>
                </PageHeader>
                <Section type='content'>
                    {displayEmptyState ? <SourcesEmptyState /> : this.renderMainContent()}
                </Section>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(
    { addProvider, createSource, filterProviders, loadEntities,
        loadSourceTypes, pageAndSize }, dispatch);

const mapStateToProps = ({ providers: { loaded, numberOfEntities, sourceTypes } }) => ({ loaded, numberOfEntities, sourceTypes });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesPage));
