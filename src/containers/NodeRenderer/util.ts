/**
 * @author ChicAboo
 * @date 2020/12/25 3:13 下午
 */
import { config } from '@/constants/config';
import { select, selectAll } from 'd3-selection';
import { _position } from '@/utils';

export function dragRender(this: SVGAElement, e: any) {
  const { width, height } = config.rect;

  const nodeId = select(this).attr('id');
  // 更新节点
  select(this)
    .select('.rectNode')
    .attr('x', e.x - width / 2)
    .attr('y', e.y - height / 2);

  // 更新节点上文字
  select(this)
    .select('.rectTextNode')
    .attr('x', e.x)
    .attr('y', e.y + config.rectText.marginTop);

  // 更新节点上四个拖拽点
  select(this)
    .selectAll('.dragPoint')
    .each(function () {
      const direction = select(this).attr('direction');
      const position = _position(e.x, e.y, direction);
      select(this).attr('cx', position.x).attr('cy', position.y);
    });

  // 更新删除按钮及文字
  select(this)
    .select('.delNode circle')
    .attr('cx', e.x + width / 2)
    .attr('cy', e.y - height / 2);
  select(this)
    .select('.delNode text')
    .attr('x', e.x + width / 2)
    .attr('y', e.y - height / 2 + 4);

  // 隐藏拖拽节点连接的边及边上的圆
  selectAll('.pathEdge').each(function () {
    const edgeId = select(this).attr('id');
    if (edgeId.indexOf(nodeId) !== -1) {
      select(this).attr('display', 'none');
    }
  });
}

/**
 *  node mouse over
 * */
export function onMouseOver(this: SVGAElement) {
  const { hover } = config.rect;
  select(this).select('.rectNode').attr('fill', hover.fill);
  select(this).select('.points').style('display', 'block');
}

/**
 *  del node btn mouse over
 * */
export function onDelMouseOver(this: SVGAElement) {
  const { strokeColor, fill } = config.rect;
  select(this).select('circle').attr('fill', strokeColor);
  select(this).select('text').attr('fill', fill);
}

/**
 *  del node btn mouse out
 * */
export function onDelMouseOut(this: SVGAElement) {
  const { strokeColor, fill } = config.rect;
  select(this).select('circle').attr('fill', fill);
  select(this).select('text').attr('fill', strokeColor);
}

/**
 *  clear node hover
 * */
export function onMouseout(this: SVGAElement) {
  const { fill } = config.rect;
  select(this).select('.rectNode').attr('fill', fill);
  select(this).select('.points').style('display', 'none');
}
