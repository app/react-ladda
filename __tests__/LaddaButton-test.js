jest.dontMock('..');

var React = require('react/addons');
var Ladda = require('ladda/dist/ladda.min');

var LaddaButton = React.createFactory(require('..'));

var TestUtils = React.addons.TestUtils;
Ladda.create = jest.genMockFunction();

describe('LaddaButton', function() {

  function createRenderedButton(props) {
    var el = LaddaButton(props, 'Click here');
    return TestUtils.renderIntoDocument(el);
  }

  it('should default to style "expand-left"', function() {
    var button = createRenderedButton({});
    var node = button.getDOMNode();
    expect(node.getAttribute('data-style')).toBe('expand-left');
  });

  it('should create a ladda button with correct attributes', function() {
    var button = createRenderedButton({
      active: true,
      progress: 0.5,
      buttonColor: '#eee',
      buttonSize: 'xl',
      spinnerSize: 30,
      spinnerColor: '#ddd',
      buttonStyle: 'slide-up'
    });

    var node = button.getDOMNode();
    expect(node.getAttribute('data-color')).toBe('#eee');
    expect(node.getAttribute('data-size')).toBe('xl');
    expect(node.getAttribute('data-style')).toBe('slide-up');
    expect(node.getAttribute('data-spinner-size')).toBe('30');
    expect(node.getAttribute('data-spinner-color')).toBe('#ddd');
  });

  it('should not trigger "onClick" event', function() {
    var onClick = jest.genMockFunction();
    var button = createRenderedButton({onClick: onClick});
    TestUtils.Simulate.click(button);
    expect(onClick.mock.calls.length).toBe(0);
  });

  describe('child element', function() {

    it('should trigger "onClick" event', function() {
      var onClick = jest.genMockFunction();
      var laddaButton = LaddaButton({onClick: onClick});
      var button = TestUtils.renderIntoDocument(laddaButton);
      var node = TestUtils.findRenderedDOMComponentWithTag(button, 'button');
      TestUtils.Simulate.click(node);
      expect(onClick.mock.calls.length).toBe(1);
    });
  });

  it('should work after multiple React.render invocations', function() {
    var buttonContainer = React.DOM.div(null, LaddaButton());
    var div = document.createElement('div');
    React.render(buttonContainer, div);
    React.render(buttonContainer, div);
    jest.runAllTimers();
    expect(div.innerHTML).toMatch(/ladda-label/);
    expect(div.innerHTML).toMatch(/ladda-spinner/);
  });
});
