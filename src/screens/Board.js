import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex } from 'reflexbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Block from '../components/Block';
import Shell from '../components/Shell';
import { colors } from '../constants';
import {
  startPresentation,
  lightenBlock,
  lightenOffBlock,
  finishPresentation,
  startGame,
} from '../actions/game';

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

const Blocks = {
  GreenBlock:   ({ ...props })  => <Block m={1} color={colors.green} className="top-left" {...props} />,
  RedBlock:     ({ ...props })  => <Block m={1} color={colors.red} className="top-right" {...props} />,
  YellowBlock:  ({ ...props })  => <Block m={1} color={colors.yellow} className="bottom-left" {...props} />,
  BlueBlock:    ({ ...props })  => <Block m={1} color={colors.blue} className="bottom-right" {...props} />,
}

class Board extends Component {

  componentDidMount() {
    const { actions } = this.props;
    actions.startGame();

    sleep(500).then(async () => {
      actions.startPresentation();
      for (let id of this.props.match) {
        actions.lightenBlock({ id });
        await sleep(500);
        actions.lightenOffBlock();
        await sleep(500);
      }
      actions.finishPresentation();
    });
  }

  renderBlock({ block, index }) {
    const Comp = Blocks[block.component];
    return <Comp {...block} key={index} />
  }

  renderRow({ from, to }) {
    return (
      <Flex
        align="center"
        justify="center"
      >
        {this.props.blocks.slice(from, to).map((block, index) => this.renderBlock({ block, index }))}
      </Flex>
    )
  }

  render() {
    const { presentation } = this.props.game;
    return (
      <Shell style={{ pointerEvents: presentation ? 'none' : 'initial' }}>
        {this.renderRow({ from: 0, to: 2 })}
        {this.renderRow({ from: 2, to: 4 })}
      </Shell>
    );
  }
}

export default connect(
  state => state,
  dispatch => ({
    actions: bindActionCreators({
      startPresentation,
      lightenBlock,
      lightenOffBlock,
      finishPresentation,
      startGame,
    }, dispatch),
  }),
)(Board);
