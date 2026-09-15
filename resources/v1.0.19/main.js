"use strict";

import { play, attachEventHandlers} from './logic.js';
import { render, subscribeToCellChanges} from './draw.js';

attachEventHandlers();
subscribeToCellChanges();
play();
render();